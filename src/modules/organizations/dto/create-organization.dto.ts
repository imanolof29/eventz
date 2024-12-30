import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateOrganizationDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "New organization's name"
    })
    name: string

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        description: "New organization's User/Owner"
    })
    userId: string

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        description: "New organization's place"
    })
    placeId: string

}