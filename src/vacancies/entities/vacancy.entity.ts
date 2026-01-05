import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

export enum VacancyModality {
    REMOTE = 'remote',
    HYBRID = 'hybrid',
    ONSITE = 'onsite', // 'presencial'
}

@Entity('vacancies')
export class Vacancy {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column()
    technologies: string; // Comma-separated or just string description

    @Column()
    seniority: string;

    @Column()
    softSkills: string;

    @Column()
    location: string; // Medellín, Barranquilla, Bogotá, Cartagena

    @Column({
        type: 'enum',
        enum: VacancyModality,
    })
    modality: VacancyModality;

    @Column()
    salaryRange: string;

    @Column()
    company: string;

    @Column('int')
    maxApplicants: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Application, (application) => application.vacancy)
    applications: Application[];
}
