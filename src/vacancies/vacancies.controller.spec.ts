import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';

describe('VacanciesController', () => {
    let controller: VacanciesController;
    let mockService;

    beforeEach(async () => {
        mockService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            toggleStatus: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [VacanciesController],
            providers: [{ provide: VacanciesService, useValue: mockService }],
        }).compile();

        controller = module.get<VacanciesController>(VacanciesController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('create should call service', async () => {
        const dto = { title: 'Test' } as CreateVacancyDto;
        await controller.create(dto);
        expect(mockService.create).toHaveBeenCalledWith(dto);
    });

    it('findAll should call service', async () => {
        await controller.findAll();
        expect(mockService.findAll).toHaveBeenCalled();
    });

    it('findOne should call service with number', async () => {
        await controller.findOne('1');
        expect(mockService.findOne).toHaveBeenCalledWith(1);
    });

    it('update should call service with number and dto', async () => {
        const dto = { title: 'New' } as UpdateVacancyDto;
        await controller.update('1', dto);
        expect(mockService.update).toHaveBeenCalledWith(1, dto);
    });

    it('toggleStatus should call service', async () => {
        await controller.toggleStatus('1');
        expect(mockService.toggleStatus).toHaveBeenCalledWith(1);
    });

    it('remove should call service', async () => {
        await controller.remove('1');
        expect(mockService.remove).toHaveBeenCalledWith(1);
    });
});
