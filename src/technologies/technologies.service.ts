import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Technology } from './entities/technology.entity';
import { Repository, In } from 'typeorm';

@Injectable()
export class TechnologiesService {
    constructor(
        @InjectRepository(Technology)
        private techRepository: Repository<Technology>,
    ) { }

    async findOrCreateMany(names: string[]): Promise<Technology[]> {
        if (!names || names.length === 0) return [];

        const sanitizedNames = names.map((n) => n.trim()).filter((n) => n !== '');

        // 1. Find existing
        const existing = await this.techRepository.find({
            where: { name: In(sanitizedNames) },
        });

        const existingNames = existing.map((t) => t.name);
        const newNames = sanitizedNames.filter((n) => !existingNames.includes(n));

        // 2. Create new
        const newEntities = this.techRepository.create(newNames.map((name) => ({ name })));
        const savedNew = await this.techRepository.save(newEntities);

        return [...existing, ...savedNew];
    }

    async findAll() {
        return await this.techRepository.find();
    }
}
