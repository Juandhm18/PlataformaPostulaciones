import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { Repository } from 'typeorm';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private vacanciesRepository: Repository<Vacancy>,
  ) { }

  async create(createVacancyDto: CreateVacancyDto) {
    const vacancy = this.vacanciesRepository.create(createVacancyDto);
    return await this.vacanciesRepository.save(vacancy);
  }

  async findAll() {
    return await this.vacanciesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const vacancy = await this.vacanciesRepository.findOneBy({ id });
    if (!vacancy) throw new NotFoundException('Vacancy not found');
    return vacancy;
  }

  async update(id: number, updateVacancyDto: UpdateVacancyDto) {
    await this.findOne(id); // Check existence
    await this.vacanciesRepository.update(id, updateVacancyDto);
    return this.findOne(id);
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
