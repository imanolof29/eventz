import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class UpdateOrganizationDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsUUID()
    @IsNotEmpty()
    userId: string

    @IsUUID()
    @IsNotEmpty()
    placeId: string

}