import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesService } from './vacancies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vacancy, VacancyModality } from './entities/vacancy.entity';
import { CreateVacancyDto } from './dto/create-vacancy.dto';

describe('VacanciesService', () => {
    let service: VacanciesService;
    let mockRepository;

    beforeEach(async () => {
        mockRepository = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VacanciesService,
                {
                    provide: getRepositoryToken(Vacancy),
                    useValue: mockRepository,
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
                technologies: 'Node',
                seniority: 'Junior',
                softSkills: 'Team',
                location: 'Med',
                modality: VacancyModality.REMOTE,
                salaryRange: '1000',
                company: 'Riwi',
                maxApplicants: 10,
            };

            mockRepository.create.mockReturnValue(dto);
            mockRepository.save.mockResolvedValue({ id: '1', ...dto });

            const result = await service.create(dto);

            expect(mockRepository.create).toHaveBeenCalledWith(dto);
            expect(mockRepository.save).toHaveBeenCalled();
            expect(result).toEqual({ id: '1', ...dto });
        });
    });
});
