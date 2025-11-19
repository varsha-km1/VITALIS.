import { Controller, Post, Body, Get, Param, UseGuards, Request, Ip } from '@nestjs/common';
import { AiDiagnosticService } from './ai-diagnostic.service';
import { CreateDiagnosticDto } from './dto/create-diagnostic.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('AI Diagnostics')
@Controller('diagnostics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DiagnosticsController {
  constructor(private readonly aiService: AiDiagnosticService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Submit clinical notes for AI analysis (Protected)' })
  @ApiResponse({ status: 201, description: 'Analysis completed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'AI processing failed' })
  async analyzeCase(
    @Body() createDiagnosticDto: CreateDiagnosticDto,
    @Request() req,
    @Ip() ip: string,
  ) {
    return this.aiService.analyzeAndSave(
      createDiagnosticDto,
      req.user.userId,
      req.user.tenantId,
      ip,
    );
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get all diagnostic reports for a patient' })
  async getPatientReports(@Param('patientId') patientId: string) {
    return this.aiService.getReportsByPatient(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific diagnostic report' })
  async getReport(@Param('id') id: string) {
    return this.aiService.getReportById(id);
  }

  @Get('critical/cases')
  @ApiOperation({ summary: 'Get critical and fatal cases' })
  async getCriticalCases() {
    return this.aiService.getCriticalCases();
  }
}

