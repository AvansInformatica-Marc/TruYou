import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ChatEntity } from "./chat.entity";

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatEntity)
        private readonly chatRepository: Repository<ChatEntity>
    ) {}

    getAllChats(): Promise<ChatEntity[]> {
        return this.chatRepository.find()
    }

    findChatById(chatId: string): Promise<ChatEntity | null> {
        return this.chatRepository.findOneBy({ chatId })
    }

    findByUserId(userId: string): Promise<ChatEntity[]> {
        return this.chatRepository.findBy({ userId })
    }

    create(chat: ChatEntity): Promise<ChatEntity> {
        return this.chatRepository.save(chat)
    }
}
