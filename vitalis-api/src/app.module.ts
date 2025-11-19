import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { PrismaModule } from './infra/database/prisma.module';
import { PrismaService } from './infra/database/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { PatientsModule } from './modules/patients/patients.module';
import { DiagnosticsModule } from './modules/diagnostics/diagnostics.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { AuditModule } from './modules/audit/audit.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { HealthModule } from './modules/health/health.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

@Module({
  imports: [
    // Global Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Rate Limiting (DDoS Protection)
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 100, // 100 requests per minute per IP
      },
    ]),

    // BullMQ for Async Job Processing
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST') || 'localhost',
          port: configService.get('REDIS_PORT') || 6379,
        },
      }),
      inject: [ConfigService],
    }),

    // Application Modules
    PrismaModule,
    HealthModule,
    AuditModule,
    TenantsModule,
    AuthModule,
    PatientsModule,
    DiagnosticsModule,
    AppointmentsModule,
  ],
  providers: [
    // Global Rate Limiting Guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // NOTE: RolesGuard is applied at controller level to ensure JWT auth runs first
    // Global Exception Filter (HIPAA Audit Logging)
    {
      provide: APP_FILTER,
      useFactory: (prisma: PrismaService) => new AllExceptionsFilter(prisma),
      inject: [PrismaService],
    },
  ],
})
export class AppModule {}

