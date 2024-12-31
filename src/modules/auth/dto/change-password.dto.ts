import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class ChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Old password"
    })
    oldPassword: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "New password"
    })
    newPassword: string
}