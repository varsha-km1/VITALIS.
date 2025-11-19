import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Ip } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

/**
 * Patients Controller with RBAC
 * JWT protected endpoints with role-based access control
 * All operations are logged for HIPAA compliance
 */
@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.VETERINARIAN) // Only admins and vets can create
  @ApiOperation({ summary: 'Register a new patient (Admin/Vet only)' })
  create(@Body() createPatientDto: CreatePatientDto, @Req() req, @Ip() ip: string) {
    const tenantId = req.user.tenantId;
    const userId = req.user.userId;
    return this.patientsService.create(createPatientDto, tenantId, userId, ip);
  }

  @Get()
  @Roles(Role.ADMIN, Role.VETERINARIAN, Role.NURSE) // All roles can read
  @ApiOperation({ summary: 'Get all patients for the authenticated user\'s tenant' })
  findAll(@Req() req, @Ip() ip: string) {
    const tenantId = req.user.tenantId;
    const userId = req.user.userId;
    return this.patientsService.findAll(tenantId, userId, ip);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.VETERINARIAN, Role.NURSE) // All roles can read
  @ApiOperation({ summary: 'Get a specific patient with diagnostic history' })
  findOne(@Param('id') id: string, @Req() req, @Ip() ip: string) {
    const tenantId = req.user.tenantId;
    const userId = req.user.userId;
    return this.patientsService.findOne(id, tenantId, userId, ip);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.VETERINARIAN) // Only admins and vets can update
  @ApiOperation({ summary: 'Update patient information (Admin/Vet only)' })
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto, @Req() req, @Ip() ip: string) {
    const tenantId = req.user.tenantId;
    const userId = req.user.userId;
    return this.patientsService.update(id, updatePatientDto, tenantId, userId, ip);
  }

  @Delete(':id')
  @Roles(Role.ADMIN) // Only admins can delete
  @ApiOperation({ summary: 'Delete a patient record (Admin only)' })
  remove(@Param('id') id: string, @Req() req, @Ip() ip: string) {
    const tenantId = req.user.tenantId;
    const userId = req.user.userId;
    return this.patientsService.remove(id, tenantId, userId, ip);
  }
}
