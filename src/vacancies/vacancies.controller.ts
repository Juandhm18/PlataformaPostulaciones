import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Vacancies')
@ApiBearerAuth()
@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) { }

  @Post()
  @Roles(UserRole.GESTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new vacancy (Manager only)' })
  create(@Body() createVacancyDto: CreateVacancyDto) {
    return this.vacanciesService.create(createVacancyDto);
  }

  @Public() // Or Restricted to Authenticated users? Req says "Consultar vacantes existentes" for Coders and Managers.
  // Req says "Un coder solo puede postularse si está autenticado".
  // "Coders: Registrarse e iniciar sesión."
  // Usually listing vacancies can be public or auth required.
  // Let's make it Public for visibility (low friction), or Auth required? 
  // "Permitir a los coders: ... Explorar vacantes disponibles"
  // "Permitir a los coders: Registrarse ... Iniciar sesión"
  // Let's keep it Authenticated as default is Auth, but Roles: Any
  @Get()
  @ApiOperation({ summary: 'List all vacancies' })
  findAll() {
    return this.vacanciesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vacancy by ID' })
  findOne(@Param('id') id: string) {
    return this.vacanciesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.GESTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a vacancy (Manager only)' })
  update(@Param('id') id: string, @Body() updateVacancyDto: UpdateVacancyDto) {
    return this.vacanciesService.update(id, updateVacancyDto);
  }

  @Patch(':id/toggle-status')
  @Roles(UserRole.GESTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Toggle vacancy status (Active/Inactive) (Manager only)' })
  toggleStatus(@Param('id') id: string) {
    return this.vacanciesService.toggleStatus(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN) // Only Admin can delete? Or Manager too? Req says "Inactivar o activar". Does not explicitly say "Delete".
  // Let's restrict Delete to Admin just in case.
  @ApiOperation({ summary: 'Delete a vacancy (Admin only)' })
  remove(@Param('id') id: string) {
    return this.vacanciesService.remove(id);
  }
}
