import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
// import { ROLES_KEY } from "../../Auth/decorators/roles.decorator
import { Role, ROLES_KEY } from "@/const"
import { SafeUserDto } from "../../dto"
import { AuthJwtPayload } from "../../types/auth-jwtPayload"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()

    const payload = user
    // console.log("payload", payload)
    if (!payload.roles.some((role) => requiredRoles.includes(role))) {
      return false
    }

    return true
  }
}
