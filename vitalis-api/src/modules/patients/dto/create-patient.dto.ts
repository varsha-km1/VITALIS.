import { IsString, IsInt, IsOptional, MinLength, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a new patient record
 * All fields are validated for data integrity
 */
export class CreatePatientDto {
  @ApiProperty({ example: 'Rex', description: 'Patient name' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'Canine', description: 'Species (e.g., Canine, Feline)' })
  @IsString()
  @MinLength(1)
  species: string;

  @ApiPropertyOptional({ example: 'German Shepherd', description: 'Breed (optional)' })
  @IsOptional()
  @IsString()
  breed?: string;

  @ApiProperty({ example: 5, description: 'Age in years' })
  @IsInt()
  @Min(0)
  @Max(100)
  age: number;

  @ApiProperty({ example: 'John Doe', description: 'Owner full name' })
  @IsString()
  @MinLength(2)
  ownerName: string;

  @ApiPropertyOptional({ example: 'john@example.com', description: 'Owner email (optional)' })
  @IsOptional()
  @IsString()
  ownerEmail?: string;

  @ApiPropertyOptional({ example: '+1-555-0123', description: 'Owner phone (optional)' })
  @IsOptional()
  @IsString()
  ownerPhone?: string;
}
