import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UpdateOrganizationDto {

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        description: "Organization's name"
    })
    name: string

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        description: "Organization's user"
    })
    userId: string

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        description: "Organization's place"
    })
    placeId: string

}