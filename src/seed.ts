import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserRole } from './users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const usersService = app.get(UsersService);

    const adminEmail = 'admin@riwi.io';
    const gestorEmail = 'gestor@riwi.io';

    const admin = await usersService.findOneByEmail(adminEmail);
    if (!admin) {
        const password = await bcrypt.hash('admin123', 10);
        await usersService.create({
            name: 'Admin User',
            email: adminEmail,
            password: password, // Note: CreateUserDto expects password, validation might fail if DTO isn't strictly checked or if we bypass controller
            // Service uses repository.create(dto), so DTO validation pipe isn't triggered here unless we use ValidationPipe explicitly.
            // But we passed plain object.
            // Wait, Service create expects CreateUserDto which has password.
            role: UserRole.ADMIN,
        } as any);
        console.log('[INFO] Admin user created');
    } else {
        console.log('[INFO] Admin user already exists');
    }

    const gestor = await usersService.findOneByEmail(gestorEmail);
    if (!gestor) {
        const password = await bcrypt.hash('gestor123', 10);
        await usersService.create({
            name: 'Gestor User',
            email: gestorEmail,
            password: password,
            role: 'gestor', // Using string directly to avoid enum import issues if tricky
        } as any);
        console.log('[INFO] Gestor user created');
    } else {
        console.log('[INFO] Gestor user already exists');
    }

    await app.close();
}
bootstrap();
