import { IsDateString, IsOptional, IsString, IsUrl, IsUUID } from "class-validator"

export class User {
    @IsUUID()
    userId!: string

    @IsString()
    name!: string

    @IsDateString()
    creationDate!: string

    @IsString()
    publicKey!: string

    @IsString()
    @IsOptional()
    certificate?: string | null

    @IsString()
    userSignature!: string

    @IsString()
    serverSignature!: string
}
