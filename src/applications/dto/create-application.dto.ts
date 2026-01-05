import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApplicationDto {
    @ApiProperty({ example: 'vacancy-uuid-1234' })
    @IsUUID()
    @IsNotEmpty()
    vacancyId: string;
}
