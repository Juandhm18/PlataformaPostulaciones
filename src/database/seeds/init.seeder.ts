import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User, UserRole } from '../../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export default class InitSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<any> {
        const repository = dataSource.getRepository(User);

        const adminEmail = 'admin@riwi.io';
        const adminExists = await repository.findOneBy({ email: adminEmail });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await repository.save({
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                role: UserRole.ADMIN,
            });
            console.log('Admin user created');
        }

        const gestorEmail = 'gestor@riwi.io';
        const gestorExists = await repository.findOneBy({ email: gestorEmail });

        if (!gestorExists) {
            const hashedPassword = await bcrypt.hash('gestor123', 10);
            await repository.save({
                name: 'Gestor User',
                email: gestorEmail,
                password: hashedPassword,
                role: UserRole.GESTOR,
            });
            console.log('[INFO] Gestor user created');
        }
    }
}
