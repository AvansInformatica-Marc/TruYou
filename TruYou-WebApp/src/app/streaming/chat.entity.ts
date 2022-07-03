import { IsDateString, IsString, IsUrl, IsUUID } from "class-validator"

export class Chat {
    @IsUUID()
    chatId!: string

    @IsUUID()
    userId!: string

    @IsUrl()
    name!: string

    @IsDateString()
    creationDate!: string

    @IsString()
    userSignature!: string
}
