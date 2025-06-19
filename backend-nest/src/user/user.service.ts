import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "../entities/user.entity"
import { Repository } from "typeorm"
import { SafeUserDto } from "../Auth/dto"

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async updateHashedRefreshToken(userId: number, hashedRefreshToken: string) {
    return await this.userRepo.update({ id: userId }, { hashedRefreshToken })
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.findByEmail(createUserDto.email)
    if (existing) throw new ConflictException("Email is already registered")

    const user = this.userRepo.create(createUserDto)
    return await this.userRepo.save(user)
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } })
  }

  async findAll(): Promise<User[]> {
    return await this.userRepo.find()
  }

  async findOne(id: number) {
    return this.userRepo.findOne({
      where: { id },
    })
  }

  async handleActivate(id: number): Promise<User> {
    const existingUser = await this.findOne(+id)
    if (!existingUser) throw new NotFoundException()

    existingUser.isActive = !existingUser.isActive

    return await this.userRepo.save(existingUser)
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } })
    if (!user) throw new NotFoundException(`User with ID ${id} not found`)

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.findByEmail(updateUserDto.email)
      if (existing) throw new ConflictException("Email is already taken")
    }

    Object.assign(user, updateUserDto)
    return await this.userRepo.save(user)
  }

  async remove(id: number): Promise<{ success: boolean; message?: string }> {
    const user = await this.userRepo.findOne({ where: { id } })
    if (!user) throw new NotFoundException(`User with ID ${id} not found`)

    await this.userRepo.remove(user)
    return { message: `User with ID ${id} removed successfully`, success: true }
  }

  sanitizeUser(input: User | User[]): SafeUserDto | SafeUserDto[] {
    const sanitize = (user: User): SafeUserDto => {
      const { password, hashedRefreshToken, ...safeUser } = user
      return safeUser as SafeUserDto
    }

    return Array.isArray(input) ? input.map(sanitize) : sanitize(input)
  }
}
