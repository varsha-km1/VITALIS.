import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

/**
 * Patients Service with HIPAA Audit Logging
 * All read/write operations are logged for compliance
 * Multi-tenancy enforced on all operations
 */
@Injectable()
export class PatientsService {
  private readonly logger = new Logger(PatientsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(createPatientDto: CreatePatientDto, tenantId: string, userId: string, ip: string) {
    const patient = await this.prisma.patient.create({
      data: {
        name: createPatientDto.name,
        species: createPatientDto.species,
        breed: createPatientDto.breed,
        age: createPatientDto.age,
        ownerName: createPatientDto.ownerName,
        ownerId: 'OWNER-' + Date.now(), // Generate a simple owner ID
        ownerContact: createPatientDto.ownerEmail || createPatientDto.ownerPhone || 'Not provided',
        tenantId,
      },
    });

    // HIPAA Compliance: Log patient creation
    await this.auditService.log(
      userId,
      'CREATE_PATIENT',
      `patients/${patient.id}`,
      JSON.stringify({ patientName: patient.name, species: patient.species }),
      ip,
    );

    this.logger.log(`Created patient ${patient.name} (${patient.id}) by user ${userId}`);

    return patient;
  }

  async findAll(tenantId: string, userId: string, ip: string) {
    const patients = await this.prisma.patient.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });

    // HIPAA Compliance: Log read access
    await this.auditService.log(
      userId,
      'READ_PATIENTS',
      'patients',
      JSON.stringify({ count: patients.length }),
      ip,
    );

    return patients;
  }

  async findOne(id: string, tenantId: string, userId: string, ip: string) {
    const patient = await this.prisma.patient.findFirst({
      where: { id, tenantId },
      include: { diagnosticReports: true },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    // HIPAA Compliance: Log read access to specific patient
    await this.auditService.log(
      userId,
      'READ_PATIENT',
      `patients/${id}`,
      JSON.stringify({ patientName: patient.name }),
      ip,
    );

    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto, tenantId: string, userId: string, ip: string) {
    const patient = await this.prisma.patient.findFirst({ 
      where: { id, tenantId } 
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    const updated = await this.prisma.patient.update({
      where: { id },
      data: updatePatientDto,
    });

    // HIPAA Compliance: Log update
    await this.auditService.log(
      userId,
      'UPDATE_PATIENT',
      `patients/${id}`,
      JSON.stringify({ changes: updatePatientDto }),
      ip,
    );

    this.logger.log(`Updated patient ${id} by user ${userId}`);

    return updated;
  }

  async remove(id: string, tenantId: string, userId: string, ip: string) {
    const patient = await this.prisma.patient.findFirst({ 
      where: { id, tenantId } 
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    await this.prisma.patient.delete({ where: { id } });

    // HIPAA Compliance: Log deletion (CRITICAL)
    await this.auditService.log(
      userId,
      'DELETE_PATIENT',
      `patients/${id}`,
      JSON.stringify({ patientName: patient.name, reason: 'Administrative deletion' }),
      ip,
    );

    this.logger.warn(`DELETED patient ${id} by user ${userId}`);

    return { message: 'Patient deleted successfully' };
  }
}
