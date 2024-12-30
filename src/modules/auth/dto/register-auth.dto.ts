import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class RegisterAuthDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "User's first name"
    })
    firstName: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "User's last name"
    })
    lastName: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "User's username"
    })
    username: string

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: "User's email"
    })
    email: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: "User's pasword"
    })
    password: string
}