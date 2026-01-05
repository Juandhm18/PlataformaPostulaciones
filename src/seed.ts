import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserRole } from './users/entities/user.entity';
import { VacanciesService } from './vacancies/vacancies.service';
import { VacancyModality } from './vacancies/entities/vacancy.entity';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const dataSource = app.get(DataSource);

    // Safety check: Clear existing data without dropping schema/types
    console.log('[SEED] Clearing existing data with TRUNCATE...');
    await dataSource.query('TRUNCATE TABLE applications RESTART IDENTITY CASCADE');
    await dataSource.query('TRUNCATE TABLE vacancies RESTART IDENTITY CASCADE');
    await dataSource.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE');

    const usersService = app.get(UsersService);
    const vacanciesService = app.get(VacanciesService);

    console.log('[SEED] Starting database initialization...');

    // 1. Create Default Users
    const adminEmail = 'admin@riwi.io';
    const gestorEmail = 'gestor@riwi.io';

    const passwordHash = await bcrypt.hash('admin123', 10);

    await usersService.create({
        name: 'Obi-Wan Kenobi',
        email: adminEmail,
        password: passwordHash,
        role: UserRole.ADMIN,
    } as any);
    console.log('[SEED] Admin user created');

    const gestorPasswordHash = await bcrypt.hash('gestor123', 10);
    await usersService.create({
        name: 'Master Yoda',
        email: gestorEmail,
        password: gestorPasswordHash,
        role: UserRole.GESTOR,
    } as any);
    console.log('[SEED] Gestor user created');

    // 2. Create Sample Vacancies
    const sampleVacancies = [
        {
            title: 'Senior Node.js Architect',
            description: 'Lead the design of our next-generation cloud infrastructure. Master of the asynchronous arts required.',
            technologies: ['Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
            seniority: 'Senior',
            softSkills: 'Leadership, Communication, Mentoring',
            location: 'Kyoto (Remote)',
            modality: VacancyModality.REMOTE,
            salaryRange: '$120k - $160k',
            company: 'Zen Systems',
            maxApplicants: 10,
            isActive: true,
        },
        {
            title: 'Principal React Engineer',
            description: 'Craft beautiful, high-performance user interfaces with the precision of a katana. Experience with React 19 and Framer Motion.',
            technologies: ['React', 'Vite', 'Tailwind CSS', 'TypeScript'],
            seniority: 'Principal',
            softSkills: 'Design Thinking, Adaptability, Detail-oriented',
            location: 'Tokyo (Hybrid)',
            modality: VacancyModality.HYBRID,
            salaryRange: '$110k - $140k',
            company: 'Night View Interactive',
            maxApplicants: 5,
            isActive: true,
        },
        {
            title: 'Staff DevOps Sorcerer',
            description: 'Automate our destiny. We need a master of Kubernetes and Terraform to build immutable temples in the cloud.',
            technologies: ['Kubernetes', 'Terraform', 'GitHub Actions', 'Docker'],
            seniority: 'Staff',
            softSkills: 'Problem Solving, Collaboration, Persistence',
            location: 'Osaka (On-site)',
            modality: VacancyModality.ONSITE,
            salaryRange: '$130k - $170k',
            company: 'Kodo Cloud',
            maxApplicants: 3,
            isActive: true,
        },
        {
            title: 'Full Stack Ninja',
            description: 'Shadowy operations across the entire stack. From PostgreSQL shadows to the bright light of Frontend.',
            technologies: ['Next.js', 'Prisma', 'GraphQL', 'Apollo'],
            seniority: 'Senior',
            softSkills: 'Versatility, Critical Thinking, Efficiency',
            location: 'Remote',
            modality: VacancyModality.REMOTE,
            salaryRange: '$90k - $130k',
            company: 'Hidden Leaf Tech',
            maxApplicants: 15,
            isActive: true,
        },
    ];

    for (const vacancy of sampleVacancies) {
        await vacanciesService.create(vacancy as any);
        console.log(`[SEED] Vacancy created: ${vacancy.title}`);
    }

    console.log('[SEED] Database seeding completed successfully');
    await app.close();
}
bootstrap();
