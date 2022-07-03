import { Body, Controller, Get, NotFoundException, Param, ParseUUIDPipe, Post, ValidationPipe } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { validationOptions } from "src/app.constants";
import { ChatEntity } from "src/data/chat.entity";
import { ChatService } from "src/data/chat.service";
import { ChatAddDto } from "./chat-add.dto";
import { ChatReadDto } from "./chat-read.dto";
import { CryptoService } from "src/crypto.service";
import { UserService } from "src/data/user.service";
import * as forge from "node-forge"

@ApiTags("chat")
@Controller({
    path: "chat",
    version: "1"
})
export class ChatsController {
    constructor (
        private readonly chatService: ChatService,
        private readonly userService: UserService,
        private readonly cryptoService: CryptoService
    ) {}

    @Get()
    @ApiOkResponse({ type: [ChatReadDto] })
    async getAllChats(): Promise<ChatReadDto[]> {
        const chats = await this.chatService.getAllChats()
        return await Promise.all(chats.map(chat => this.mapChatEntityToReadDto(chat)))
    }

    @Get(":chatId")
    @ApiNotFoundResponse()
    @ApiOkResponse({ type: ChatReadDto })
    @ApiBadRequestResponse()
    async getChatById(
        @Param("chatId", new ParseUUIDPipe()) chatId: string
    ): Promise<ChatReadDto> {
        const chat = await this.chatService.findChatById(chatId)

        if (chat == null) {
            throw new NotFoundException()
        }

        return await this.mapChatEntityToReadDto(chat)
    }

    @Post()
    @ApiCreatedResponse({ type: ChatReadDto })
    @ApiBadRequestResponse()
    async createChat(
        @Body(new ValidationPipe(validationOptions)) chatAddDto: ChatAddDto
    ): Promise<ChatReadDto> {
        const user = await this.userService.findByUserId(chatAddDto.userId)
        const publicUserKey = user?.certificate == null ? null : forge.pki.publicKeyFromPem(user?.publicKey)
        const signatureMessage = `userId:${chatAddDto.userId};name:${chatAddDto.name};`
        const verified = publicUserKey != null
            && this.cryptoService.verifyMessageWithKey(signatureMessage, chatAddDto.userSignature, publicUserKey)

        if (!verified) {
            console.warn(`ChatController: Invalid signature (POST /chat)`)
        }

        const chatEntity = new ChatEntity()
        chatEntity.userId = chatAddDto.userId
        chatEntity.userSignature = chatAddDto.userSignature
        chatEntity.name = chatAddDto.name
        return await this.mapChatEntityToReadDto(await this.chatService.create(chatEntity))
    }

    private async mapChatEntityToReadDto(entity: ChatEntity): Promise<ChatReadDto> {
        const chat = new ChatReadDto()
        chat.userId = entity.userId
        chat.chatId = entity.chatId
        chat.name = entity.name
        chat.creationDate = new Date(entity.creationDate).toISOString()
        chat.userSignature = entity.userSignature

        const message = `userId:${chat.userId};chatId:${chat.chatId};creationDate:${chat.creationDate};` +
            `name:${chat.name};userSignature:${chat.userSignature};`
        chat.serverSignature = await this.cryptoService.signMessage(message)

        return chat
    }
}
