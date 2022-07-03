import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsString, IsUUID } from "class-validator"

export class ChatReadDto {
    @ApiProperty()
    @IsUUID()
    chatId: string

    @ApiProperty()
    @IsUUID()
    userId: string

    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsDateString()
    creationDate: string

    @ApiProperty()
    @IsString()
    userSignature: string

    @ApiProperty()
    @IsString()
    serverSignature: string
}
