import { SafeUserDto } from "../dto"
import { Role } from "../enums/role.enum"

type CurrentUser = {
  id: number
  user: SafeUserDto
}
