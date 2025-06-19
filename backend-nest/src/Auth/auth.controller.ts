import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LocalAuthGuard } from "./guards/local-auth/local-auth.guard"
import { RefreshAuthGuard } from "./guards/refresh-auth/refresh-auth.guard"
import { JwtAuthGuard } from "./guards/jwt-auth/jwt-auth.guard"
import { Public } from "./decorators/public.decorator"
import { ApiBody, ApiOkResponse } from "@nestjs/swagger"
import { LoginDto, LoginResponseDto } from "./dto"
import { CreateUserDto } from "../user/dto/create-user.dto"
import { AuthJwtPayload } from "./types/auth-jwtPayload"

@Public()
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: LoginResponseDto })
  @Post("login")
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @Post("register")
  async register(@Request() req: Request & { body: CreateUserDto }) {
    const registeruser = req.body as CreateUserDto
    return this.authService.register(registeruser)
  }

  @UseGuards(RefreshAuthGuard)
  @Post("refresh")
  refreshToken(@Req() req) {
    return this.authService.refreshToken(req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @Post("signout")
  signOut(@Req() req: Request & { user: AuthJwtPayload }) {
    if (!req.user) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: "Unauthorized",
        error: "Unauthorized",
      }
    }
    return this.authService.signOut(req.user.sub)
  }

  // @Public()
  // @UseGuards(GoogleAuthGuard)
  // @Get("google/login")
  // googleLogin() {}

  // @Public()
  // @UseGuards(GoogleAuthGuard)
  // @Get("google/callback")
  // async googleCallback(@Req() req, @Res() res) {
  //   const response = await this.authService.login(req.user.id)
  //   res.redirect(`http://localhost:5173?token=${response.accessToken}`)
  // }
}
