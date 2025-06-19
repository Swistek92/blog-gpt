import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { CreateUserDto } from '../user/dto/create-user.dto'
import { LoginResponseDto } from './dto'
import { AuthJwtPayload } from './types/auth-jwtPayload'
import { Role } from '@/const'

 
describe('AuthController', () => {
  let controller: AuthController
  let authService: AuthService

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
    refreshToken: jest.fn(),
    signOut: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('login', () => {
    it('should return access token on lssogin', async () => {
      const user = { id: 1 }
      const response: LoginResponseDto = { accessToken: 'token', refreshToken: 'refresh', id: 1,  roles: [Role.USER] }

      mockAuthService.login.mockResolvedValue(response)

      const result = await controller.login({ user })
      expect(result).toEqual(response)
      expect(authService.login).toHaveBeenCalledWith(user)
    })
  })

  describe('register', () => {
    it('should register a user', async () => {
      const dto: CreateUserDto = { name: 'qwert' ,email: 'test@example.com', password: 'pass' }
      const result = { id: 1, ...dto }

      mockAuthService.register.mockResolvedValue(result)

      const req = { body: dto }
      const response = await controller.register(req as any)
      expect(response).toEqual(result)
      expect(authService.register).toHaveBeenCalledWith(dto)
    })
  })

  describe('refreshToken', () => {
    it('should return new token', async () => {
      mockAuthService.refreshToken.mockResolvedValue({ accessToken: 'newToken' })

      const req = { user: { id: 1 } }
      const response = await controller.refreshToken(req as any)
      expect(response).toEqual({ accessToken: 'newToken' })
      expect(authService.refreshToken).toHaveBeenCalledWith(1)
    })
  })

  describe('signOut', () => {
    it('should return unauthorized if user is missing', async () => {
      const req = {} as any
      const response = await controller.signOut(req)
      expect(response).toEqual({
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      })
    })

    it('should call authService.signOut if user exists', async () => {
      const user: AuthJwtPayload = { sub: 1, email: 'test@example.com', roles: [Role.USER] }    
      mockAuthService.signOut.mockResolvedValue({ success: true })

      const req = { user }
      const result = await controller.signOut(req as any)
      expect(result).toEqual({ success: true })
      expect(authService.signOut).toHaveBeenCalledWith(1)
    })
  })
})
