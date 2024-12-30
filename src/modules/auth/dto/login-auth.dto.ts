import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty } from "class-validator"

export class LoginAuthDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        description: "User email"
    })
    email: string

    @IsNotEmpty()
    @ApiProperty({
        description: "User password"
    })
    password: string
}