import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Vacancy } from '../../vacancies/entities/vacancy.entity';

@Entity('technologies')
export class Technology {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ unique: true })
    name: string;

    @ManyToMany(() => Vacancy, (vacancy) => vacancy.technologies)
    vacancies: Vacancy[];
}
