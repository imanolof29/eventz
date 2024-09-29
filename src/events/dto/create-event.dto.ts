import { IsArray, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator"

export class CreateEventDto {

    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsNotEmpty()
    @IsNumber()
    latitude: number

    @IsNotEmpty()
    @IsNumber()
    longitude: number

    @IsNotEmpty()
    @IsUUID("4", { each: true })
    categoryIds: string[]

}