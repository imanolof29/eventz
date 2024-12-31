import { ApiProperty } from "@nestjs/swagger"

export class AuthResponseDto {
    @ApiProperty({
        description: "Auth access token"
    })
    accessToken: string
    @ApiProperty({
        description: "Auth refresh token"
    })
    refreshToken: string
    @ApiProperty({
        description: "Logged user email"
    })
    email: string
}