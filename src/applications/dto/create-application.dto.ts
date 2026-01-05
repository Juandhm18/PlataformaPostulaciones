import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
    @ApiProperty({ example: 1 })
    @IsNumber()
    @IsNotEmpty()
    vacancyId: number;
}
