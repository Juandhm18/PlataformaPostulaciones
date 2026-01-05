import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesService } from './vacancies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vacancy, VacancyModality } from './entities/vacancy.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { TechnologiesService } from '../technologies/technologies.service';
import { NotFoundException } from '@nestjs/common';

describe('VacanciesService', () => {
    let service: VacanciesService;
    let mockRepository;
    let mockTechnologiesService;

    beforeEach(async () => {
        mockRepository = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        mockTechnologiesService = {
            findOrCreateMany: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VacanciesService,
                {
                    provide: getRepositoryToken(Vacancy),
                    useValue: mockRepository,
                },
                {
                    provide: TechnologiesService,
                    useValue: mockTechnologiesService,
                },
            ],
        }).compile();

        service = module.get<VacanciesService>(VacanciesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create and save a vacancy', async () => {
            const dto: CreateVacancyDto = {
                title: 'Dev',
                description: 'Desc',
                technologies: ['Node'],
                seniority: 'Junior',
                softSkills: 'Team',
                location: 'Med',
                modality: VacancyModality.REMOTE,
                salaryRange: '1000',
                company: 'Riwi',
                maxApplicants: 10,
            };

            const techEntities = [{ id: 1, name: 'Node' }];
            mockTechnologiesService.findOrCreateMany.mockResolvedValue(techEntities);
            mockRepository.create.mockReturnValue({ ...dto, technologies: techEntities });
            mockRepository.save.mockResolvedValue({ id: 1, ...dto, technologies: techEntities });

            const result = await service.create(dto);

            expect(mockTechnologiesService.findOrCreateMany).toHaveBeenCalledWith(['Node']);
            expect(mockRepository.save).toHaveBeenCalled();
            expect(result).toEqual({ id: 1, ...dto, technologies: techEntities });
        });
    });

    describe('findAll', () => {
        it('should return all vacancies', async () => {
            const vacancies = [{ id: 1, title: 'Dev' }];
            mockRepository.find.mockResolvedValue(vacancies);

            const result = await service.findAll();

            expect(mockRepository.find).toHaveBeenCalled();
            expect(result).toEqual(vacancies);
        });
    });

    describe('findOne', () => {
        it('should return a vacancy if found', async () => {
            const vacancy = { id: 1, title: 'Dev' };
            mockRepository.findOne.mockResolvedValue(vacancy);

            const result = await service.findOne(1);

            expect(mockRepository.findOne).toHaveBeenCalledWith({
                where: { id: 1 },
                relations: ['technologies'],
            });
            expect(result).toEqual(vacancy);
        });

        it('should throw NotFoundException if not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);
            await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update a vacancy with new technologies', async () => {
            const vacancy = { id: 1, title: 'Old', technologies: [] };
            mockRepository.findOne.mockResolvedValue(vacancy);

            const dto: UpdateVacancyDto = { title: 'New', technologies: ['React'] };
            const techEntities = [{ id: 2, name: 'React' }];
            mockTechnologiesService.findOrCreateMany.mockResolvedValue(techEntities);
            mockRepository.save.mockResolvedValue({ ...vacancy, ...dto, technologies: techEntities });

            const result = await service.update(1, dto);

            expect(mockTechnologiesService.findOrCreateMany).toHaveBeenCalledWith(['React']);
            expect(result.title).toBe('New');
            expect(result.technologies).toEqual(techEntities);
        });

        it('should update a vacancy without changing technologies', async () => {
            const vacancy = { id: 1, title: 'Old', technologies: [{ id: 1, name: 'Node' }] };
            mockRepository.findOne.mockResolvedValue(vacancy);

            const dto: UpdateVacancyDto = { title: 'New' };
            mockRepository.save.mockResolvedValue({ ...vacancy, ...dto });

            const result = await service.update(1, dto);

            expect(mockTechnologiesService.findOrCreateMany).not.toHaveBeenCalled();
            expect(result.title).toBe('New');
            expect(result.technologies[0].name).toBe('Node');
        });
    });

    describe('remove', () => {
        it('should remove a vacancy', async () => {
            mockRepository.findOne.mockResolvedValue({ id: 1 });
            mockRepository.delete.mockResolvedValue({ affected: 1 });

            const result = await service.remove(1);

            expect(mockRepository.delete).toHaveBeenCalledWith(1);
            expect(result).toEqual({ message: 'Vacancy removed' });
        });
    });

    describe('toggleStatus', () => {
        it('should toggle isActive status', async () => {
            const vacancy = { id: 1, isActive: true };
            mockRepository.findOne.mockResolvedValue(vacancy);
            mockRepository.save.mockImplementation(v => Promise.resolve(v));

            const result = await service.toggleStatus(1);

            expect(result.isActive).toBe(false);

            mockRepository.findOne.mockResolvedValue(result);
            const result2 = await service.toggleStatus(1);
            expect(result2.isActive).toBe(true);
        });
    });
});
