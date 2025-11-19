import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';

/**
 * HIPAA Compliance: Audit Logging Service
 * Tracks all sensitive operations for regulatory compliance
 * Supports both simple text details and structured JSON metadata
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(
    userId: string,
    action: string,
    resource: string,
    details?: string,
    ipAddress?: string,
  ) {
    try {
      // Parse details if it's valid JSON, otherwise keep as text
      let metadata: any = null;
      if (details) {
        try {
          metadata = JSON.parse(details);
        } catch {
          // Not JSON, keep as null and use details field
        }
      }

      await this.prisma.auditLog.create({
        data: {
          userId,
          action,
          resource,
          details: !metadata ? details : null, // Use details if not JSON
          metadata: metadata, // Use metadata if JSON
          ipAddress,
        },
      });

      this.logger.log(
        `[AUDIT] User: ${userId} | Action: ${action} | Resource: ${resource}`,
      );
    } catch (error) {
      this.logger.error('Failed to create audit log', error);
    }
  }

  async getAuditTrail(userId?: string, limit = 100) {
    return this.prisma.auditLog.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });
  }

  async getResourceHistory(resource: string) {
    return this.prisma.auditLog.findMany({
      where: { resource },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });
  }
}
