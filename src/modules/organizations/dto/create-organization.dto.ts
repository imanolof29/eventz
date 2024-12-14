import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateOrganizationDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsUUID()
    @IsNotEmpty()
    userId: string

}