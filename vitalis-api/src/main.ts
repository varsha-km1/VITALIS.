import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('VitalisBootstrap');

  // 1. Security Middleware
  app.use(helmet());
  
  // 2. Cookie Parser (CRITICAL: Required to read the HttpOnly Refresh Token)
  app.use(cookieParser());

  // 3. CORS Configuration
  // 'credentials: true' is mandatory for the frontend to send/receive cookies
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });

  // 4. Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true,
    transform: true 
  }));

  // 5. Swagger / OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Vitalis OS API')
    .setDescription('HIPAA-Compliant Veterinary AI System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // 6. Start Server
  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Vitalis System Operational on Port ${port}`);
}
bootstrap();