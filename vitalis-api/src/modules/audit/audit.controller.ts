import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Audit Logs')
@Controller('audit')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('trail')
  @ApiOperation({ summary: 'Get audit trail (HIPAA compliance)' })
  async getAuditTrail(
    @Query('userId') userId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.auditService.getAuditTrail(userId, limit ? +limit : 100);
  }

  @Get('resource')
  @ApiOperation({ summary: 'Get audit history for a specific resource' })
  async getResourceHistory(@Query('resource') resource: string) {
    return this.auditService.getResourceHistory(resource);
  }
}

