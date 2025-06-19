import { ConfigType } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import jwtConfig from "../config/jwt.config"
import { AuthJwtPayload } from "../../Auth/types/auth-jwtPayload"
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import refreshJwtConfig from "../config/refresh-jwt.config"
import { Request } from "express"
import { AuthService } from "../auth.service"

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, "refresh-jwt") {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private refrshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: refrshJwtConfiguration.secret,
      ignoreExpiration: false,
      passReqToCallback: true,
    })
  }

  // authorization: Bearer sldfk;lsdkf'lskald'sdkf;sdl

  validate(req: Request, payload: AuthJwtPayload) {
    const tokenExtractor = ExtractJwt.fromAuthHeaderAsBearerToken()
    const refreshToken = tokenExtractor(req)
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token missing")
    }

    return this.authService.validateRefreshToken(payload, refreshToken)
  }
}
