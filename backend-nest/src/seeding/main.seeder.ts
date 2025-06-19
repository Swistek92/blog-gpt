import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { User } from '../entities/user.entity'
import { Role } from '@/const' // <- upewnij się że alias @ działa
import { faker } from '@faker-js/faker'
import { PostEN } from '../entities/postEN.entity'

export class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    const userRepo = dataSource.getRepository(User)

    // 1. Seed użytkowników
    const usersToInsert = [
      {
        id: 1,
        email: 'admin@example.com',
        password: 'admin',
        name: 'Admin',
        roles: [Role.ADMIN, Role.MODERATOR, Role.USER],
        isActive: true,
        verified: true,
        avatar: 'assets/avatars/admin.png',
        createdAt: new Date('2024-04-01T12:00:00Z'),
        lastLogin: new Date('2024-04-03T15:30:00Z'),
      },
      {
        id: 2,
        email: 'newuser@example.com',
        password: 'secret123',
        name: 'New User',
        roles: [Role.USER],
        isActive: true,
        verified: false,
        avatar: 'assets/avatars/default.png',
        createdAt: new Date('2024-04-02T08:30:00Z'),
        lastLogin: new Date('2024-04-02T08:30:00Z'),
      },
    ]

    const insertedUsers: User[] = []

    for (const userData of usersToInsert) {
      const user = userRepo.create(userData)
      insertedUsers.push(await userRepo.save(user))
    }

    console.log('✅ Seeded users')

   // 3. Posts
    const postFactory = await factoryManager.get(PostEN)
    console.log('📝 Generating posts...')
    const posts = await Promise.all(
      Array(20).fill(null).map(() =>
        postFactory.make({
          author: faker.helpers.arrayElement(insertedUsers),
          author_id: undefined, // zabezpieczenie przed konfliktem
        }),
      ),
    )
    await dataSource.getRepository(PostEN).save(posts)
    console.log('✅ Seeded 20 posts')
  }
}
