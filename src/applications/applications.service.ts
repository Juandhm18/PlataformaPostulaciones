import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Repository } from 'typeorm';
import { VacanciesService } from '../vacancies/vacancies.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    private vacanciesService: VacanciesService,
  ) { }

  async create(userId: string, createApplicationDto: CreateApplicationDto) {
    const { vacancyId } = createApplicationDto;

    // 1. Check if vacancy exists and is active
    const vacancy = await this.vacanciesService.findOne(vacancyId);
    if (!vacancy.isActive) {
      throw new BadRequestException('Cannot apply to an inactive vacancy');
    }

    // 2. Check if vacancy has spots
    const currentApplicationsCount = await this.applicationsRepository.count({
      where: { vacancyId },
    });
    if (currentApplicationsCount >= vacancy.maxApplicants) {
      throw new BadRequestException('Vacancy is full');
    }

    // 3. Check if user already applied
    const existingApplication = await this.applicationsRepository.findOne({
      where: { userId, vacancyId },
    });
    if (existingApplication) {
      throw new BadRequestException('You have already applied to this vacancy');
    }

    // 4. Check if user has < 3 active applications
    // We count applications where the related vacancy is active
    const userActiveApplications = await this.applicationsRepository.count({
      where: {
        userId,
        vacancy: { isActive: true },
      },
      relations: ['vacancy'],
    });

    if (userActiveApplications >= 3) {
      throw new BadRequestException('You cannot have more than 3 active applications');
    }

    // 5. Create application
    const application = this.applicationsRepository.create({
      userId,
      vacancyId,
    });
    return await this.applicationsRepository.save(application);
  }

  async findAll(user: any) {
    // If Admin or Gestor, return all. If Coder, return only theirs?
    // Requirement for Gestor: "Listar postulaciones".
    // Requirement for Coder: Not explicitly asking to list their applications, but good to have.

    /* 
       Note: The original requirement said "Gestor ... Consultar postulaciones" and "Coder ... Consultar vacantes".
       But usually a Coder wants to see their applications.
       I will return all for Admin/Gestor, and filter for Coder.
    */

    const options: any = {
      relations: ['user', 'vacancy'],
      order: { appliedAt: 'DESC' },
    };

    if (user.role === 'coder') {
      options.where = { userId: user.id };
    }

    return await this.applicationsRepository.find(options);
  }

  async findOne(id: string) {
    const application = await this.applicationsRepository.findOne({
      where: { id },
      relations: ['user', 'vacancy'],
    });
    if (!application) throw new NotFoundException('Application not found');
    return application;
  }
}
