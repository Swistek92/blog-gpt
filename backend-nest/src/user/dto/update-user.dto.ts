import { ApiProperty } from "@nestjs/swagger"

export class UpdateUserDto {
  @ApiProperty({ example: "John" })
  name: string

  @ApiProperty({ example: "john@example.com" })
  email: string
}
