import { IsString, IsNotEmpty, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VacancyModality } from '../entities/vacancy.entity';

export class CreateVacancyDto {
    @ApiProperty({ example: 'Desarrollador Backend java' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Estamos buscando un desarrollador Java con experiencia...' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 'Java, Spring Boot, PostgreSQL' })
    @IsString()
    @IsNotEmpty()
    technologies: string;

    @ApiProperty({ example: 'Senior' })
    @IsString()
    @IsNotEmpty()
    seniority: string;

    @ApiProperty({ example: 'Trabajo en equipo, Comunicación asertiva' })
    @IsString()
    @IsNotEmpty()
    softSkills: string;

    @ApiProperty({ example: 'Medellín' })
    @IsString()
    @IsNotEmpty()
    location: string;

    @ApiProperty({ enum: VacancyModality, example: VacancyModality.REMOTE })
    @IsEnum(VacancyModality)
    modality: VacancyModality;

    @ApiProperty({ example: '3000000 - 4500000 COP' })
    @IsString()
    @IsNotEmpty()
    salaryRange: string;

    @ApiProperty({ example: 'Tech Solutions Inc.' })
    @IsString()
    @IsNotEmpty()
    company: string;

    @ApiProperty({ example: 5, minimum: 1 })
    @IsNumber()
    @Min(1)
    maxApplicants: number;
}
