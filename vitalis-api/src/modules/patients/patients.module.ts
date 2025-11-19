import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { AuditModule } from '../audit/audit.module';
import { PrismaModule } from '../../infra/database/prisma.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}

