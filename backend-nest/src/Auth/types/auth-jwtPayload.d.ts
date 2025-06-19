import { SafeUserDto } from "../dto"
import { Role } from "../enums/role.enum"

export type AuthJwtPayload = {
  sub: number
  email: string
  roles: Role[]
}
