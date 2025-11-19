import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService } from '../../infra/database/prisma.service';

/**
 * Global Exception Filter for HIPAA Compliance
 * Logs all exceptions to the audit trail for regulatory compliance
 * Injectable decorator is CRITICAL for proper dependency injection
 */
@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly prisma: PrismaService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    // Extract user context if available (from JWT)
    const userId = (request as any).user?.userId;
    const ipAddress = request.ip || request.socket.remoteAddress || 'unknown';

    // Log error details
    this.logger.error(
      `HTTP ${status} Error on ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // HIPAA Compliance: Async audit log (fire-and-forget to not block response)
    this.logToAuditTrail(userId, request, status, message, ipAddress);

    // Return sanitized error to client
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: this.sanitizeMessage(message),
    });
  }

  /**
   * Log exception to audit trail
   */
  private async logToAuditTrail(
    userId: string | undefined,
    request: Request,
    status: number,
    message: any,
    ipAddress: string,
  ) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: userId || null,
          action: 'HTTP_EXCEPTION',
          resource: `${request.method} ${request.url}`,
          ipAddress,
          metadata: {
            statusCode: status,
            message: typeof message === 'string' ? message : JSON.stringify(message),
            userAgent: request.headers['user-agent'],
            method: request.method,
            path: request.url,
          },
        },
      });
    } catch (auditError) {
      // Fail silently to not cascade errors
      this.logger.error('Failed to log to audit trail', auditError);
    }
  }

  /**
   * Sanitize error messages to prevent sensitive data leakage
   */
  private sanitizeMessage(message: any): string {
    if (typeof message === 'string') {
      return message;
    }
    if (message?.message) {
      return message.message;
    }
    return 'An error occurred';
  }
}

