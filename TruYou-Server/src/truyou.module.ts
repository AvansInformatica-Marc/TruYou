import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatsController } from './api/chat.controller'
import { MessageController } from './api/message.controller'
import { UserController } from './api/user.controller'
import { CryptoService } from './crypto.service'
import { ChatEntity } from './data/chat.entity'
import { ChatService } from './data/chat.service'
import { MessageEntity } from './data/message.entity'
import { MessageService } from './data/message.service'
import { UserEntity } from './data/user.entity'
import { UserService } from './data/user.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, ChatEntity, MessageEntity])
    ],
    controllers: [UserController, ChatsController, MessageController],
    providers: [UserService, ChatService, MessageService, CryptoService]
})
export class TruYouModule {}
