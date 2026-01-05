import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { VacanciesService } from '../vacancies/vacancies.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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

        it('should fail if user already applied', async () => {
            const vacancy = { id: 1, isActive: true, maxApplicants: 5 };
            mockVacanciesService.findOne.mockResolvedValue(vacancy);
            mockAppRepo.count.mockResolvedValueOnce(0);
            mockAppRepo.findOne.mockResolvedValue({ id: 99 }); // already applied

            await expect(service.create(1, { vacancyId: 1 })).rejects.toThrow(BadRequestException);
        });

        it('should fail if user has >= 3 active applications', async () => {
            const vacancy = { id: 1, isActive: true, maxApplicants: 5 };
            mockVacanciesService.findOne.mockResolvedValue(vacancy);
            mockAppRepo.count
                .mockResolvedValueOnce(0) // apps check
                .mockResolvedValueOnce(3); // user active apps check
            mockAppRepo.findOne.mockResolvedValue(null);

            await expect(service.create(1, { vacancyId: 1 })).rejects.toThrow(BadRequestException);
        });
    });

    describe('findAll', () => {
        it('should return all applications for admin', async () => {
            const user = { id: 1, role: 'admin' };
            const apps = [{ id: 1, userId: 2 }];
            mockAppRepo.find.mockResolvedValue(apps);

            const result = await service.findAll(user);
            expect(result).toEqual(apps);
            expect(mockAppRepo.find).toHaveBeenCalledWith(expect.objectContaining({
                relations: ['user', 'vacancy']
            }));
        });

        it('should return only self applications for coder', async () => {
            const user = { id: 1, role: 'coder' };
            const apps = [{ id: 1, userId: 1 }];
            mockAppRepo.find.mockResolvedValue(apps);

            const result = await service.findAll(user);
            expect(result).toEqual(apps);
            expect(mockAppRepo.find).toHaveBeenCalledWith(expect.objectContaining({
                where: { userId: 1 }
            }));
        });
    });

    describe('findOne', () => {
        it('should return an application if found', async () => {
            const app = { id: 1 };
            mockAppRepo.findOne.mockResolvedValue(app);

            const result = await service.findOne(1);
            expect(result).toEqual(app);
        });

        it('should throw NotFoundException if not found', async () => {
            mockAppRepo.findOne.mockResolvedValue(null);
            await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
        });
    });
});
