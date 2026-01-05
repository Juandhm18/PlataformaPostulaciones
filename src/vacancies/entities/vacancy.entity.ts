import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';
import { Technology } from '../../technologies/entities/technology.entity';

export enum VacancyModality {
    REMOTE = 'remote',
    HYBRID = 'hybrid',
    ONSITE = 'onsite', // 'presencial'
}

@Entity('vacancies')
export class Vacancy {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @ManyToMany(() => Technology, (technology) => technology.vacancies, { cascade: true })
    @JoinTable({
        name: 'vacancy_technologies',
        joinColumn: { name: 'vacancy_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'technology_id', referencedColumnName: 'id' },
    })
    technologies: Technology[];

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
