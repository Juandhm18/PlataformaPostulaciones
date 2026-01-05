import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
    let service: UsersService;
    let mockRepo;

    beforeEach(async () => {
        mockRepo = {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                { provide: getRepositoryToken(User), useValue: mockRepo },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
    });

    describe('create', () => {
        it('should create and save a user', async () => {
            const dto = { name: 'Test' };
            mockRepo.create.mockReturnValue(dto);
            mockRepo.save.mockResolvedValue({ id: 1, ...dto });

            const result = await service.create(dto as any);
            expect(result.id).toBe(1);
        });
    });

    describe('findAll', () => {
        it('should return all users', async () => {
            const users = [{ id: 1 }];
            mockRepo.find.mockResolvedValue(users);
            expect(await service.findAll()).toEqual(users);
        });
    });

    describe('findOne', () => {
        it('should return user if found', async () => {
            const user = { id: 1 };
            mockRepo.findOneBy.mockResolvedValue(user);
            expect(await service.findOne(1)).toEqual(user);
        });

        it('should throw if not found', async () => {
            mockRepo.findOneBy.mockResolvedValue(null);
            await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findOneByEmail', () => {
        it('should return user with selected fields', async () => {
            const user = { email: 't@t.com' };
            mockRepo.findOne.mockResolvedValue(user);
            expect(await service.findOneByEmail('t@t.com')).toEqual(user);
        });
    });

    describe('update', () => {
        it('should return update message', () => {
            expect(service.update(1, {} as any)).toContain('updates a #1 user');
        });
    });

    describe('remove', () => {
        it('should return remove message', () => {
            expect(service.remove(1)).toContain('removes a #1 user');
        });
    });
});
