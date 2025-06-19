import { IsEmail, IsOptional, IsString, IsUrl } from "class-validator"

export class CreateUserDto {
  @IsString()
  name: string // zamiast firstName i lastName

  @IsEmail()
  email: string

  @IsOptional()
  @IsUrl()
  @IsString()
  avatar?: string

  @IsString()
  password: string
}
