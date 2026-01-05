import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { UserRole } from '../users/entities/user.entity';

jest.mock('bcrypt');

describe('AuthService', () => {
    let service: AuthService;
    let mockUsersService;
    let mockJwtService;

    beforeEach(async () => {
        mockUsersService = {
            findOneByEmail: jest.fn(),
            create: jest.fn(),
        };
        mockJwtService = {
            sign: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    describe('validateUser', () => {
        it('should return user without password if valid', async () => {
            const user = { email: 'test@test.com', password: 'hashed_password' };
            mockUsersService.findOneByEmail.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await service.validateUser('test@test.com', 'pass');
            expect(result).toEqual({ email: 'test@test.com' });
        });

        it('should return null if password mismatch', async () => {
            const user = { email: 'test@test.com', password: 'hashed_password' };
            mockUsersService.findOneByEmail.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const result = await service.validateUser('test@test.com', 'wrong');
            expect(result).toBeNull();
        });

        it('should return null if invalid email', async () => {
            mockUsersService.findOneByEmail.mockResolvedValue(null);
            const result = await service.validateUser('none@test.com', 'pass');
            expect(result).toBeNull();
        });
    });

    describe('login', () => {
        it('should return access_token', async () => {
            const user = { id: 1, email: 't@t.com', name: 'Tester', role: UserRole.CODER };
            mockJwtService.sign.mockReturnValue('token');

            const result = await service.login(user as any);
            expect(result.access_token).toBe('token');
            expect(result.user.name).toBe('Tester');
        });
    });

    describe('register', () => {
        it('should create a new user', async () => {
            const dto = { email: 'new@t.com', password: 'plain', name: 'New' };
            mockUsersService.findOneByEmail.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
            mockUsersService.create.mockResolvedValue({ ...dto, password: 'hashed' });

            const result = await service.register(dto as any);
            expect(result.email).toBe('new@t.com');
            expect(mockUsersService.create).toHaveBeenCalled();
        });

        it('should throw if user exists', async () => {
            mockUsersService.findOneByEmail.mockResolvedValue({ id: 1 });
            await expect(service.register({ email: 'ex@t.com' } as any)).rejects.toThrow(BadRequestException);
        });
    });
});
