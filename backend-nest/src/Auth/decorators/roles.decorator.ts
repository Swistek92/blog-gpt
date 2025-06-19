import { SetMetadata } from "@nestjs/common"
import { Role, ROLES_KEY } from "@/const"

export const Roles = (...roles: [Role, ...Role[]]) => SetMetadata(ROLES_KEY, roles)
