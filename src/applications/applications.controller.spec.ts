import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';

describe('ApplicationsController', () => {
    let controller: ApplicationsController;
    let mockService;

    beforeEach(async () => {
        mockService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [ApplicationsController],
            providers: [{ provide: ApplicationsService, useValue: mockService }],
        }).compile();

        controller = module.get<ApplicationsController>(ApplicationsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('create should call service with user id', async () => {
        const req = { user: { id: 1 } };
        const dto = { vacancyId: 2 };
        await controller.create(req, dto as any);
        expect(mockService.create).toHaveBeenCalledWith(1, dto);
    });

    it('findAll should call service with user', async () => {
        const req = { user: { id: 1, role: 'coder' } };
        await controller.findAll(req);
        expect(mockService.findAll).toHaveBeenCalledWith(req.user);
    });

    it('findOne should call service with number', async () => {
        await controller.findOne('1');
        expect(mockService.findOne).toHaveBeenCalledWith(1);
    });
});
