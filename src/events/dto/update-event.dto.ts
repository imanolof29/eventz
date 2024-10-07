import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class UpdateEventDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Fiestas', description: 'Event name' })
    name: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Fiestas en donosti', description: 'Event description' })
    description: string

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: 43.3214, description: 'Event latitude' })
    latitude: number

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({ example: -1.9857, description: 'Event longitude' })
    longitude: number

}