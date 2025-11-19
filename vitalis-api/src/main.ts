import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('VitalisBootstrap');

  // Security Headers
  app.use(helmet());
  
  // Cookie Parser (Required for HttpOnly refresh tokens)
  app.use(cookieParser());

  // CORS Configuration with Credentials Support
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Required for cookies
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Vitalis OS API')
    .setDescription('HIPAA-Compliant Veterinary AI System with Multi-Tenant Architecture')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addTag('Authentication', 'JWT-based authentication with refresh tokens')
    .addTag('Patients', 'Patient management with RBAC')
    .addTag('AI Diagnostics', 'Async AI diagnostic processing')
    .addTag('Audit Logs', 'HIPAA compliance audit trails')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log('═══════════════════════════════════════════════════');
  logger.log(`🚀 Vitalis OS API Operational on port ${port}`);
  logger.log(`📚 API Docs: http://localhost:${port}/api/docs`);
  logger.log(`🏥 HIPAA Compliance: ENABLED`);
  logger.log(`⚡ Async Queues: ENABLED (Redis + BullMQ)`);
  logger.log(`🔐 Rate Limiting: ENABLED (ThrottlerGuard)`);
  logger.log('═══════════════════════════════════════════════════');
}

bootstrap();

