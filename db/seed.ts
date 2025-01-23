import { User } from "src/modules/users/user.entity";
import { DataSource, Repository } from "typeorm";

export const AppDatasource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'user',
    password: 'password',
    database: 'fiestas_db',
    entities: [User],
    synchronize: false,
})

async function seed() {
    try {
        const datasource = await AppDatasource.initialize()
        const userRepository: Repository<User> = datasource.getRepository(User)
        const user = {
            firstName: 'Admin',
            lastName: 'Admin',
            email: 'admin@gmail.com',
            username: 'admin',
            password: 'admin',
            role: 'ADMIN',
            verified: true,
        } as User
        const newUser = userRepository.create(user)
        await userRepository.save(newUser)
        console.log("Seeding complete")
        process.exit(0)
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

seed()