import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TenantsService } from './tenants.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tenants')
@Controller('tenants')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tenant (Admin only)' })
  create(@Body() createTenantDto: { name: string; subdomain?: string }) {
    return this.tenantsService.create(createTenantDto.name, createTenantDto.subdomain);
  }

  @Get()
  @ApiOperation({ summary: 'List all tenants' })
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tenant details' })
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Get(':id/statistics')
  @ApiOperation({ summary: 'Get tenant statistics' })
  getStatistics(@Param('id') id: string) {
    return this.tenantsService.getStatistics(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tenant' })
  update(@Param('id') id: string, @Body() updateDto: { name?: string; active?: boolean }) {
    return this.tenantsService.update(id, updateDto);
  }
}

