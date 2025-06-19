import { Test, TestingModule } from '@nestjs/testing'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { ForbiddenException } from '@nestjs/common'
import { Role } from '@/const'
import { User } from '../entities/user.entity'

describe('UserController', () => {
  let controller: UserController
  let userService: jest.Mocked<UserService>

  const mockUser: User = {
    id: 1,
    name: 'Jan Kowalski',
    email: 'jan.kowalski@example.com',
    password: 'hashed-password',
    roles: [Role.USER],
    isActive: true,
    verified: true,
    avatar: 'https://example.com/avatar.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    lastLogin: new Date(),
    hashedRefreshToken: 'hashed-refresh-token',
    hashPassword: jest.fn(),
  }

  const mockUserService = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    sanitizeUser: jest.fn((u) => u),
    update: jest.fn(),
    remove: jest.fn(),
    handleActivate: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile()

    controller = module.get<UserController>(UserController)
    userService = module.get(UserService)
  })

  afterEach(() => jest.clearAllMocks())

  describe('getProfile', () => {
    it('should return sanitized user', async () => {
      userService.findOne.mockResolvedValueOnce(mockUser)

      const req = { user: { sub: 1 } }
      const result = await controller.getProfile(req as any)

      expect(result).toEqual(mockUser)
      expect(userService.findOne).toHaveBeenCalledWith(1)
      expect(userService.sanitizeUser).toHaveBeenCalledWith(mockUser)
    })

    it('should return null if user not found', async () => {
      userService.findOne.mockResolvedValueOnce(null)

      const req = { user: { sub: 999 } }
      const result = await controller.getProfile(req as any)

      expect(result).toBeNull()
    })
  })

  describe('update', () => {
    it('should allow owner to update', async () => {
      const dto = { name: 'New Name', email: 'asd@123.pl' }
      const updated = { ...mockUser, name: 'New Name', hashPassword: jest.fn() }
      userService.update.mockResolvedValueOnce(updated)

      const req = { user: { sub: 1, roles: [Role.USER] } }
      const result = await controller.update(1, dto, req as any)

      expect(result).toEqual(updated)
    })

    it('should allow admin to update another user', async () => {
      const dto = { name: 'Admin Updated', email: '' }
      const req = { user: { sub: 2, roles: [Role.ADMIN] } }
      const updated = { ...mockUser, name: 'Admin Updated', hashPassword: jest.fn() }

      userService.update.mockResolvedValueOnce(updated)

      const result = await controller.update(1, dto, req as any)
      expect(result).toEqual(updated)
    })

    it('should throw ForbiddenException if not owner/admin', async () => {
      const req = { user: { sub: 2, roles: [Role.USER] } }
      await expect(() => controller.update(1, { name: 'asd', email: '' }, req as any))
        .rejects.toThrow(ForbiddenException)
    })
  })

  describe('remove', () => {
  it('should allow admin to remove any user', async () => {
    const req = { user: { sub: 99, roles: [Role.ADMIN] } }
    userService.remove.mockResolvedValueOnce({ success: true })

    const result = await controller.remove('1', req as any)
    expect(result).toEqual({ success: true })
    expect(userService.remove).toHaveBeenCalledWith(1)
  })

  it('should allow user to remove themselves', async () => {
    const req = { user: { sub: 1, roles: [Role.USER] } }
    userService.remove.mockResolvedValueOnce({ success: true })

    const result = await controller.remove('1', req as any)
    expect(result).toEqual({ success: true })
    expect(userService.remove).toHaveBeenCalledWith(1)
  })

it('should throw if not owner or admin', async () => {
  const req = { user: { sub: 2, roles: [Role.USER] } }

  try {
    await controller.remove('1', req as any)
    fail('Expected ForbiddenException')
  } catch (err) {
    expect(err).toBeInstanceOf(ForbiddenException)
    expect(err.message).toBe('You can only delete your own account.')
    expect(userService.remove).not.toHaveBeenCalled()
  }
})

})


  describe('GetAll', () => {
    it('should return sanitized list', async () => {
      const users = [mockUser]
      userService.findAll.mockResolvedValueOnce(users)

      const result = await controller.GetAll()
      expect(result).toEqual(users)
      expect(userService.sanitizeUser).toHaveBeenCalledWith(users)
    })
  })

  describe('active', () => {
    it('should toggle user active status', async () => {
      const userToToggle = { ...mockUser, isActive: false, hashPassword: jest.fn() }
      userService.findOne.mockResolvedValueOnce(userToToggle)
userService.handleActivate.mockResolvedValueOnce(mockUser)
      userService.sanitizeUser.mockImplementation((u) => u)

      const result = await controller.active(1)

      expect(result.isActive).toBe(true)
      expect(userService.handleActivate).toHaveBeenCalledWith(1)
    })

    it('should throw if user not found', async () => {
      userService.findOne.mockResolvedValueOnce(null)
      await expect(() => controller.active(999)).rejects.toThrow(ForbiddenException)
    })
  })
})
