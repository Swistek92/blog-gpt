import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { UpdateUserDto } from "./dto/update-user.dto"
import { Role } from "@/const"
import { Roles } from "../Auth/decorators/roles.decorator"
import { RolesGuard } from "../Auth/guards/roles/roles.guard"
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  ApiParam,
} from "@nestjs/swagger"
import { SafeUserDto } from "../Auth/dto"
import { AuthJwtPayload } from "../Auth/types/auth-jwtPayload"

@ApiBearerAuth("access-token") // Wymaga Bearer Token w nagłówku Authorization
@ApiTags("User") // Grupuje endpointy w Swaggerze jako "User"
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * GET /user/profile
   * Zwraca profil aktualnie zalogowanego użytkownika.
   * Wymaga JWT Bearer Token.
   */
  @Get("profile")
  @ApiOperation({ summary: "Get current user's profile (JWT- required)" })
  @ApiOkResponse({ type: SafeUserDto })
  async getProfile(@Req() req: Request & { user: AuthJwtPayload }): Promise<SafeUserDto | null> {
    const user = await this.userService.findOne(req.user.sub)
    if (!user) {
      return null 
    }
    const safeUser = this.userService.sanitizeUser(user) as SafeUserDto
    return safeUser 
  }

  /**
   * PATCH /user/:id
   * Aktualizuje dane użytkownika.
   * Może być wykonane przez właściciela konta lub admina.
   * Wymaga JWT.
   */
  @Patch(":id")
  @ApiOperation({ summary: "Update a user (owner or admin)" })
  @ApiParam({ name: "id", type: Number })
  @ApiBody({ type: UpdateUserDto })
  async update(
    @Param("id") id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request & { user: AuthJwtPayload },
  ): Promise<SafeUserDto> {
    const user = req.user
    const isAdmin = user.roles.includes(Role.ADMIN)
    const isOwner = user.sub === id

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException("You are not allowed to update this user.")
    }

    const updatedUser = await this.userService.update(id, updateUserDto)
    return this.userService.sanitizeUser(updatedUser) as SafeUserDto
  }

  /**
   * DELETE /user/remove/:id
   * Usuwa użytkownika.
   * Może być wykonane przez właściciela konta lub admina.
   * Wymaga JWT + roli USER lub ADMIN.
   */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  @Delete("remove/:id")
  @ApiOperation({ summary: "Remove user (self or by admin) (JWT- required)" })
  @ApiParam({ name: "id", type: Number })
  remove(@Param("id") id: string, @Req() req: Request & { user: AuthJwtPayload }) {
    const currentUser = req.user
    const targetUserId = +id
    const isOwner = currentUser.sub === targetUserId
    const isAdmin = currentUser.roles.includes(Role.ADMIN)

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException("You can only delete your own account.")
    }

    return this.userService.remove(targetUserId)
  }

  /**
   * GET /user/all
   * Zwraca listę wszystkich użytkowników (dla admina).
   * Wymaga roli ADMIN i JWT.
   */
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get("all")
  @ApiOperation({ summary: "Get all users (admin only) (JWT- required)" })
  @ApiOkResponse({ type: [SafeUserDto] })
  GetAll() {
    const users = this.userService.findAll()
    return users.then((u) => this.userService.sanitizeUser(u))
  }

  /**
   * POST /user/active/:id
   * Przełącza status aktywności użytkownika (aktywuj/dezaktywuj).
   * Tylko dla admina.
   */
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post("active/:id")
  @ApiOperation({ summary: "Toggle active status of a user (admin only) (JWT- required)" })
  @ApiParam({ name: "id", type: Number })
  @Post("active/:id")
  async active(@Param("id") id: number) {
    const user = await this.userService.findOne(id)
    if (!user) {
      throw new ForbiddenException(`User with ID ${id} not found`)
    }
    user.isActive = !user.isActive
    await this.userService.handleActivate(id)
    return this.userService.sanitizeUser(user) as SafeUserDto
  }
}
