import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { VacanciesService } from '../vacancies/vacancies.service';
import { BadRequestException } from '@nestjs/common';

describe('ApplicationsService', () => {
    let service: ApplicationsService;
    let mockAppRepo;
    let mockVacanciesService;

    beforeEach(async () => {
        mockAppRepo = {
            count: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
        };

        mockVacanciesService = {
            findOne: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ApplicationsService,
                {
                    provide: getRepositoryToken(Application),
                    useValue: mockAppRepo,
                },
                {
                    provide: VacanciesService,
                    useValue: mockVacanciesService,
                },
            ],
        }).compile();

        service = module.get<ApplicationsService>(ApplicationsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create an application if checks pass', async () => {
            const vacancyId = 1;
            const userId = 1;

            const vacancy = { id: vacancyId, isActive: true, maxApplicants: 5 };
            mockVacanciesService.findOne.mockResolvedValue(vacancy);

            // Spots check: count = 0
            mockAppRepo.count
                .mockResolvedValueOnce(0) // for applications check
                .mockResolvedValueOnce(0); // for active applications user check

            // Duplicate check: findOne = null
            mockAppRepo.findOne.mockResolvedValue(null);

            mockAppRepo.create.mockReturnValue({ userId, vacancyId });
            mockAppRepo.save.mockResolvedValue({ id: 1, userId, vacancyId });

            const result = await service.create(userId, { vacancyId });

            expect(result).toEqual({ id: 1, userId, vacancyId });
        });

        it('should fail if vacancy inactive', async () => {
            mockVacanciesService.findOne.mockResolvedValue({ isActive: false });
            await expect(service.create(1, { vacancyId: 1 })).rejects.toThrow(BadRequestException);
        });

        it('should fail if vacancy is full', async () => {
            const vacancy = { id: 1, isActive: true, maxApplicants: 1 };
            mockVacanciesService.findOne.mockResolvedValue(vacancy);
            mockAppRepo.count.mockResolvedValueOnce(1); // apps check

            await expect(service.create(1, { vacancyId: 1 })).rejects.toThrow(BadRequestException);
        });
    });
});
