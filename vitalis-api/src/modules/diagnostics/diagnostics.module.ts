import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { DiagnosticsController } from './diagnostics.controller';
import { AiDiagnosticService } from './ai-diagnostic.service';
import { DiagnosticsProcessor } from './diagnostics.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'diagnostics',
    }),
  ],
  controllers: [DiagnosticsController],
  providers: [AiDiagnosticService, DiagnosticsProcessor],
  exports: [AiDiagnosticService],
})
export class DiagnosticsModule {}

