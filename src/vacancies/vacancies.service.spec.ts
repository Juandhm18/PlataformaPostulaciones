import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesService } from './vacancies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vacancy, VacancyModality } from './entities/vacancy.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { TechnologiesService } from '../technologies/technologies.service';

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
});
