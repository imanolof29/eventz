import { ApiProperty } from "@nestjs/swagger"

export class UpdateUserDto {

    @ApiProperty({ example: 'Antonio', description: 'User first name' })
    firstName: string

    @ApiProperty({ example: 'Recio', description: 'User last name' })
    lastName: string

    @ApiProperty({ example: 'antoniorecio', description: 'User username' })
    username: string

}