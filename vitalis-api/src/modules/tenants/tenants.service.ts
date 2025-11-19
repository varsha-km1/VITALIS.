import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string, subdomain?: string) {
    return this.prisma.tenant.create({
      data: { name, subdomain },
    });
  }

  async findAll() {
    return this.prisma.tenant.findMany({
      include: {
        _count: {
          select: {
            users: true,
            patients: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
        _count: {
          select: {
            patients: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }

    return tenant;
  }

  async update(id: string, data: { name?: string; active?: boolean }) {
    return this.prisma.tenant.update({
      where: { id },
      data,
    });
  }

  async getStatistics(tenantId: string) {
    const [userCount, patientCount, diagnosticCount] = await Promise.all([
      this.prisma.user.count({ where: { tenantId } }),
      this.prisma.patient.count({ where: { tenantId } }),
      this.prisma.diagnosticReport.count({
        where: { patient: { tenantId } },
      }),
    ]);

    return {
      users: userCount,
      patients: patientCount,
      diagnostics: diagnosticCount,
    };
  }
}

