import { ConfigType } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import jwtConfig from "../config/jwt.config"
import { AuthJwtPayload } from "../../Auth/types/auth-jwtPayload"
import { Inject, Injectable } from "@nestjs/common"
import { AuthService } from "../auth.service"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret,
      ignoreExpiration: false,
    })
  }

  validate(payload: AuthJwtPayload) {
    return payload
  }
}
