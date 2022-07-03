import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsUUID } from "class-validator"

export class ChatAddDto {
    @ApiProperty()
    @IsUUID()
    userId: string

    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    userSignature: string
}
