import { Controller, Get, Post, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Applications')
@ApiBearerAuth()
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) { }

  @Post()
  @Roles(UserRole.CODER)
  @ApiOperation({ summary: 'Apply to a vacancy (Coder only)' })
  create(@Request() req, @Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(req.user.id, createApplicationDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.GESTOR, UserRole.CODER)
  @ApiOperation({ summary: 'List applications (Admin/Gestor: All, Coder: Own)' })
  findAll(@Request() req) {
    return this.applicationsService.findAll(req.user);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR) // Maybe Coder can see their own? For now restrict.
  @ApiOperation({ summary: 'Get application details' })
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }
}
