import { Role } from "const"
import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsEmail, IsNumber, IsString, MinLength } from "class-validator"

export class LoginDto {
  @ApiProperty({
    example: "admin@example.com",
    description: "Email użytkownika używany do logowania",
  })
  @IsEmail()
  email: string

  @ApiProperty({
    example: "admin",
    description: "Hasło użytkownika",
  })
  @IsString()
  @MinLength(4)
  password: string
}

export class LoginResponseDto {
  @ApiProperty({ example: 1, description: "ID użytkownika" })
  @IsNumber()
  id: number

  @ApiProperty({ example: ["USER"], description: "Role użytkownika", isArray: true })
  @IsArray()
  roles: Role[]

  @ApiProperty({ example: "jwt-access-token", description: "Token dostępu JWT" })
  @IsString()
  accessToken: string

  @ApiProperty({ example: "jwt-refresh-token", description: "Token odświeżający JWT" })
  @IsString()
  refreshToken: string
}
