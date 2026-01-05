import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { Repository } from 'typeorm';
import { TechnologiesService } from '../technologies/technologies.service';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private vacanciesRepository: Repository<Vacancy>,
    private technologiesService: TechnologiesService,
  ) { }

  async create(createVacancyDto: CreateVacancyDto) {
    const { technologies, ...vacancyData } = createVacancyDto;

    const techEntities = await this.technologiesService.findOrCreateMany(technologies);

    const vacancy = this.vacanciesRepository.create({
      ...vacancyData,
      technologies: techEntities,
    });

    return await this.vacanciesRepository.save(vacancy);
  }

  async findAll() {
    return await this.vacanciesRepository.find({
      relations: ['technologies'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const vacancy = await this.vacanciesRepository.findOne({
      where: { id },
      relations: ['technologies'],
    });
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return vacancy;
  }

  async update(id: number, updateVacancyDto: UpdateVacancyDto) {
    const vacancy = await this.findOne(id);
    const { technologies, ...updateData } = updateVacancyDto;

    if (technologies) {
      const techEntities = await this.technologiesService.findOrCreateMany(technologies);
      vacancy.technologies = techEntities;
    }

    Object.assign(vacancy, updateData);
    return await this.vacanciesRepository.save(vacancy);
  }

  async remove(id: number) {
    await this.findOne(id); // Check existence
    await this.vacanciesRepository.delete(id);
    return { message: 'Vacancy removed' };
  }

  async toggleStatus(id: number) {
    const vacancy = await this.findOne(id);
    vacancy.isActive = !vacancy.isActive;
    return await this.vacanciesRepository.save(vacancy);
  }
}
