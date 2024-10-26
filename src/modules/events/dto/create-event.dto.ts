import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator"

export class CreateEventDto {

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

    @IsNotEmpty()
    @IsUUID("4", { each: true })
    @ApiProperty({
        example: [
            "2cd5a28e-835d-4aec-bbe7-6f3c9ff8dbcc",
            "c0213543-8d47-42a4-8868-a5068d06846f"
        ],
        description: 'Event category ids'
    })
    categoryIds: string[]

    @IsNumber()
    @IsOptional()
    price: number

    @IsNumber()
    @IsOptional()
    ticketLimit: number

    @IsNumber()
    @IsOptional()
    ticketsSold: number

}