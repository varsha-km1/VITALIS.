import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PrismaService } from '../../infra/database/prisma.service';
import { CreateDiagnosticDto } from './dto/create-diagnostic.dto';
import { Severity } from '@prisma/client';

/**
 * AI Diagnostic Service with Async Queue Processing
 * Offloads AI analysis to background workers via BullMQ
 * Prevents API blocking and improves scalability
 */
@Injectable()
export class AiDiagnosticService {
  private readonly logger = new Logger(AiDiagnosticService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('diagnostics') private readonly diagnosticsQueue: Queue,
  ) {}

  async analyzeAndSave(dto: CreateDiagnosticDto, userId?: string, tenantId?: string, ipAddress?: string) {
    try {
      // 1. Multi-tenancy check: Verify patient belongs to tenant
      if (tenantId) {
        const patient = await this.prisma.patient.findFirst({
          where: {
            id: dto.patientId,
            tenantId: tenantId,
          },
        });

        if (!patient) {
          throw new InternalServerErrorException('Patient not found or access denied');
        }
      }

      this.logger.log(`Queueing AI diagnostic for patient ${dto.patientId}`);

      // 2. Create placeholder diagnostic report
      const report = await this.prisma.diagnosticReport.create({
        data: {
          patientId: dto.patientId,
          symptoms: dto.clinicalNotes,
          rawInput: dto.clinicalNotes,
          aiAnalysis: '🔄 Processing... AI analysis in progress. Please check back in a few moments.',
          confidence: 0.0,
          severity: Severity.LOW, // Temporary, will be updated by worker
        },
      });

      // 3. Queue the heavy AI processing job (non-blocking)
      await this.diagnosticsQueue.add('analyze', {
        reportId: report.id,
        symptoms: dto.clinicalNotes,
      });

      this.logger.log(`Diagnostic report ${report.id} queued for async processing`);

      // 4. HIPAA Compliance: Audit log (if user context available)
      if (userId) {
        await this.prisma.auditLog.create({
          data: {
            userId,
            action: 'CREATE_DIAGNOSTIC',
            resource: `DiagnosticReport:${report.id}`,
            metadata: {
              patientId: dto.patientId,
              status: 'QUEUED',
            },
            ipAddress: ipAddress || 'unknown',
          },
        });
      }

      // 5. Return enriched data
      return {
        status: 'QUEUED',
        message: 'Diagnostic report queued for AI processing',
        data: report,
        meta: {
          aiModel: 'VITALIS-NEXUS-V4',
          timestamp: new Date().toISOString(),
          complianceNote: 'Action logged for HIPAA audit trail',
          tenantIsolated: !!tenantId,
          estimatedProcessingTime: '2-3 seconds',
        },
      };
    } catch (error) {
      this.logger.error('AI diagnostic queue failed', error);
      throw new InternalServerErrorException('AI Neural Link Failed');
    }
  }

  async getReportsByPatient(patientId: string) {
    return this.prisma.diagnosticReport.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
      include: {
        patient: {
          select: {
            name: true,
            species: true,
            breed: true,
          },
        },
      },
    });
  }

  async getReportById(id: string) {
    return this.prisma.diagnosticReport.findUnique({
      where: { id },
      include: { patient: true },
    });
  }

  async getCriticalCases() {
    return this.prisma.diagnosticReport.findMany({
      where: {
        severity: {
          in: [Severity.CRITICAL, Severity.FATAL],
        },
      },
      include: {
        patient: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
  }
}
