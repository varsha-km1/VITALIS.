import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('DiagnosticsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true,
      transform: true 
    }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/diagnostics/analyze (POST)', () => {
    it('should return AI analysis for critical condition', () => {
      return request(app.getHttpServer())
        .post('/diagnostics/analyze')
        .send({ 
          patientId: '123e4567-e89b-12d3-a456-426614174000', 
          clinicalNotes: 'Patient has high fever and unconsciousness with severe bleeding.' 
        })
        .expect(201)
        .then((response) => {
          expect(response.body.status).toEqual('PROCESSED');
          expect(response.body.data.severity).toEqual('CRITICAL');
          expect(response.body.data.confidence).toBeGreaterThan(0.9);
          expect(response.body.meta.aiModel).toEqual('VITALIS-NEXUS-V4');
        });
    });

    it('should return AI analysis for stable condition', () => {
      return request(app.getHttpServer())
        .post('/diagnostics/analyze')
        .send({ 
          patientId: '123e4567-e89b-12d3-a456-426614174001', 
          clinicalNotes: 'Patient appears healthy, regular checkup.' 
        })
        .expect(201)
        .then((response) => {
          expect(response.body.status).toEqual('PROCESSED');
          expect(response.body.data.severity).toEqual('LOW');
        });
    });

    it('should reject invalid payload', () => {
      return request(app.getHttpServer())
        .post('/diagnostics/analyze')
        .send({ 
          clinicalNotes: 'Missing patient ID' 
        })
        .expect(400);
    });
  });
});

