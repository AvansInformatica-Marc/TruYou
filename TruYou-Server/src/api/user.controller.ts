import { Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Post, UnauthorizedException, ValidationPipe } from "@nestjs/common"
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger"
import { validationOptions } from "src/app.constants"
import { UserEntity } from "src/data/user.entity"
import { UserService } from "src/data/user.service"
import { UserAddDto } from "./user-add.dto"
import { UserReadDto } from "./user-read.dto"
import { pki } from "node-forge"
import * as crypto from "node:crypto"
import { CryptoService } from "src/crypto.service"

@ApiTags("users")
@Controller({
    path: "users",
    version: "1"
})
export class UserController {
    constructor (
        private readonly userService: UserService,
        private readonly cryptoService: CryptoService
    ) {}

    @Get()
    @ApiOkResponse({ type: [UserReadDto] })
    async getAllUsers(): Promise<UserReadDto[]> {
        const users = await this.userService.getAllUsers()
        return await Promise.all(users.map(user => this.mapUserEntityToUserReadDto(user)))
    }

    @Get(":userId")
    @ApiNotFoundResponse()
    @ApiOkResponse({ type: UserReadDto })
    @ApiBadRequestResponse()
    async getUserById(
        @Param("userId", new ParseUUIDPipe()) userId: string
    ): Promise<UserReadDto> {
        const user = await this.userService.findByUserId(userId)

        if (user == null) {
            throw new NotFoundException()
        }

        return await this.mapUserEntityToUserReadDto(user)
    }

    @Post()
    @ApiCreatedResponse({ type: UserReadDto })
    @ApiBadRequestResponse()
    @ApiUnauthorizedResponse()
    async createUser(
        @Body(new ValidationPipe(validationOptions)) userAddDto: UserAddDto
    ): Promise<UserReadDto> {
        const userEntity = new UserEntity()
        userEntity.name = userAddDto.name
        userEntity.publicKey = userAddDto.publicKey
        userEntity.userSignature = userAddDto.userSignature

        const message = `name:${userEntity.name};publicKey:${userEntity.publicKey.replace(/\r\n/g, "")};`
        const signer = crypto.createVerify('RSA-SHA512')
        signer.write(message)
        signer.end()

        const userKey = pki.publicKeyFromPem(userAddDto.publicKey)
        const isVerified = this.cryptoService.verifyMessageWithKey(message, userEntity.userSignature, userKey)

        if(!isVerified) {
            throw new UnauthorizedException()
        }

        const createdUser = await this.userService.create(userEntity)

        const cert = await this.cryptoService.createUserCertificate(
            createdUser.userId,
            createdUser.creationDate,
            userKey
        )

        const userWithCertificate = await this.userService.addCertificate(createdUser, pki.certificateToPem(cert))
        return await this.mapUserEntityToUserReadDto(userWithCertificate)
    }

    private async mapUserEntityToUserReadDto(entity: UserEntity): Promise<UserReadDto> {
        const user = new UserReadDto()
        user.userId = entity.userId
        user.name = entity.name
        user.creationDate = new Date(entity.creationDate).toISOString()
        user.publicKey = entity.publicKey
        user.certificate = entity.certificate
        user.userSignature = entity.userSignature

        const message = `userId:${user.userId};name:${user.name};creationDate:${user.creationDate};` +
            `publicKey:${user.publicKey.replace(/\r\n/g, "")};certificate:${user.certificate?.replace(/\r\n/g, "")};` +
            `userSignature:${user.userSignature};`
        user.serverSignature = await this.cryptoService.signMessage(message)
        return user
    }
}
