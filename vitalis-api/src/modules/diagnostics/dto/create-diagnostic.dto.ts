import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDiagnosticDto {
  @ApiProperty({ 
    description: 'The patient ID',
    example: 'a1b2c3d4-5678-90ab-cdef-1234567890ab'
  })
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ 
    description: 'Clinical notes or symptoms observed',
    example: 'Patient presents with lethargy, high fever (104°F), and vomiting. No appetite for 48 hours.'
  })
  @IsString()
  @IsNotEmpty()
  clinicalNotes: string;
}

