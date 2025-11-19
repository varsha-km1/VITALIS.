import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { PrismaService } from '../../infra/database/prisma.service';
import { Severity } from '@prisma/client';

/**
 * BullMQ Worker for Async AI Diagnostic Processing
 * Offloads heavy AI computations to background jobs
 * Prevents request blocking and improves API responsiveness
 */
@Processor('diagnostics')
export class DiagnosticsProcessor {
  private readonly logger = new Logger(DiagnosticsProcessor.name);

  constructor(private readonly prisma: PrismaService) {}

  @Process('analyze')
  async handleAnalysis(job: Job<{ reportId: string; symptoms: string }>) {
    this.logger.log(`Processing diagnostic job ${job.id} for report ${job.data.reportId}`);

    try {
      const { reportId, symptoms } = job.data;

      // Simulate Heavy AI Processing (2-3 seconds)
      // In production, this would call:
      // - OpenAI GPT-4 API for NLP
      // - TensorFlow/PyTorch models for medical imaging
      // - Custom ML models trained on veterinary data
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simple keyword-based classification (demo)
      const lowerSymptoms = symptoms.toLowerCase();
      
      const isFatal = lowerSymptoms.includes('collapse') || 
                      lowerSymptoms.includes('no pulse') ||
                      lowerSymptoms.includes('respiratory arrest');
      
      const isCritical = lowerSymptoms.includes('blood') || 
                         lowerSymptoms.includes('bleeding') ||
                         lowerSymptoms.includes('unconscious') ||
                         lowerSymptoms.includes('seizure');
      
      const isModerate = lowerSymptoms.includes('fever') ||
                         lowerSymptoms.includes('vomiting') ||
                         lowerSymptoms.includes('pain');

      let severity: Severity = Severity.LOW;
      let analysis = 'Condition stable. Monitor vitals for 24 hours.';
      let confidence = 0.92;

      if (isFatal) {
        severity = Severity.FATAL;
        analysis = '⚠️ FATAL CONDITION: Immediate life-saving intervention required. Initiate CPR protocol. Notify emergency team.';
        confidence = 0.99;
      } else if (isCritical) {
        severity = Severity.CRITICAL;
        analysis = '🚨 CRITICAL ALERT: Symptoms suggest internal hemorrhaging or acute organ failure. Immediate surgical intervention recommended. Activate emergency protocol.';
        confidence = 0.98;
      } else if (isModerate) {
        severity = Severity.MODERATE;
        analysis = '⚡ Moderate symptoms detected. Recommend comprehensive blood work, imaging (X-ray/ultrasound). Monitor for progression.';
        confidence = 0.95;
      }

      // Update diagnostic report with AI analysis
      await this.prisma.diagnosticReport.update({
        where: { id: reportId },
        data: {
          aiAnalysis: analysis,
          confidence,
          severity,
        },
      });

      this.logger.log(`✅ Completed analysis for report ${reportId} - Severity: ${severity}`);
    } catch (error) {
      this.logger.error(`❌ Failed to process diagnostic job ${job.id}`, error);
      throw error; // Bull will retry based on configuration
    }
  }
}

