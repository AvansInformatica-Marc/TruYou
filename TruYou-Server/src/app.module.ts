import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { TypeOrmModule } from '@nestjs/typeorm'
import { join } from 'node:path'
import { TruYouModule } from './truyou.module'
import { MessageEntity } from './data/message.entity'
import { UserEntity } from './data/user.entity'
import { ChatEntity } from './data/chat.entity'

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env["POSTGRES_HOST"],
            port: parseInt(process.env["POSTGRES_PORT"]!),
            username: process.env["POSTGRES_USER"],
            password: process.env["POSTGRES_PASSWORD"],
            database: process.env["POSTGRES_DB"],
            entities: [UserEntity, ChatEntity, MessageEntity],
            synchronize: true
        }),
        TruYouModule,
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), "assets"),
        })
    ]
})
export class AppModule {}
