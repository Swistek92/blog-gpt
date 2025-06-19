import { faker } from "@faker-js/faker"
import { setSeederFactory } from "typeorm-extension"
import { User } from "../entities/user.entity"
import { Role } from "@/const"


export const UserFactory = setSeederFactory(User, (faker) => {
  const user = new User()

  user.name = faker.person.fullName()
  user.email = faker.internet.email()
  user.avatar = faker.image.avatar()
  user.password = faker.internet.password()
  user.roles = [Role.USER]
  user.isActive = true
  user.verified = faker.datatype.boolean()
  user.lastLogin = faker.date.recent()

  return user
})
