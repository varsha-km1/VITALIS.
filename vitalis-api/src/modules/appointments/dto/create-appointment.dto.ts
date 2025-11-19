import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  patientName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vetId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vetName: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  dateTime: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}

