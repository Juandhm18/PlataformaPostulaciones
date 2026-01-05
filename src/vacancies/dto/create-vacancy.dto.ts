import { IsString, IsNotEmpty, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VacancyModality } from '../entities/vacancy.entity';

export class CreateVacancyDto {
    @ApiProperty({ example: 'Backend Developer' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'We are looking for a Node.js developer...' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 'Node.js, NestJS, PostgreSQL' })
    @IsString()
    @IsNotEmpty()
    technologies: string;

    @ApiProperty({ example: 'Junior' })
    @IsString()
    @IsNotEmpty()
    seniority: string;

    @ApiProperty({ example: 'Teamwork, Communication' })
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
