
import { ApiProperty } from "@nestjs/swagger"
import { Role } from "const"

export class UserDto {
  @ApiProperty({ example: 1, description: "ID użytkownika" })
  id: number

  @ApiProperty({
    example: "Jan Kowalski",
    description: "Imię i nazwisko użytkownika",
    required: false,
  })
  name?: string

  @ApiProperty({ example: "jan.kowalski@example.com", description: "Email użytkownika" })
  email: string

  @ApiProperty({ example: "hashed-password", description: "Zahasłowane hasło użytkownika" })
  password: string

  @ApiProperty({ example: ["USER"], description: "Role użytkownika", isArray: true })
  roles: Role[]

  @ApiProperty({ example: true, description: "Czy użytkownik jest aktywny" })
  isActive: boolean

  @ApiProperty({ example: false, description: "Czy użytkownik jest zweryfikowany" })
  verified: boolean

  @ApiProperty({
    example: "https://example.com/avatar.jpg",
    description: "URL avatara użytkownika",
    required: false,
  })
  avatar?: string

  @ApiProperty({ description: "Data utworzenia konta", type: String, format: "date-time" })
  createdAt: Date

  @ApiProperty({ description: "Data ostatniej aktualizacji", type: String, format: "date-time" })
  updatedAt: Date

  @ApiProperty({
    description: "Data ostatniego logowania",
    type: String,
    format: "date-time",
    required: false,
  })
  lastLogin?: Date

  @ApiProperty({
    example: "hashed-refresh-token",
    description: "Zahasłowany token odświeżania",
    required: false,
  })
  hashedRefreshToken?: string
}

export class SafeUserDto {
  @ApiProperty({ example: 1, description: "ID użytkownika" })
  id: number

  @ApiProperty({
    example: "Jan Kowalski",
    description: "Imię i nazwisko użytkownika",
    required: false,
  })
  name?: string

  @ApiProperty({ example: "jan.kowalski@example.com", description: "Email użytkownika" })
  email: string

  @ApiProperty({ example: ["USER"], description: "Role użytkownika", isArray: true })
  roles: Role[]

  @ApiProperty({ example: true, description: "Czy użytkownik jest aktywny" })
  isActive: boolean

  @ApiProperty({ example: false, description: "Czy użytkownik jest zweryfikowany" })
  verified: boolean

  @ApiProperty({
    example: "https://example.com/avatar.jpg",
    description: "URL avatara użytkownika",
    required: false,
  })
  avatar?: string

  @ApiProperty({ description: "Data utworzenia konta", type: String, format: "date-time" })
  createdAt: Date

  @ApiProperty({ description: "Data ostatniej aktualizacji", type: String, format: "date-time" })
  updatedAt: Date

  @ApiProperty({
    description: "Data ostatniego logowania",
    type: String,
    format: "date-time",
    required: false,
  })
  lastLogin?: Date


 
}
