import { HttpClient } from '@angular/common/http'
import { Injectable } from "@angular/core"
import { plainToInstance } from 'class-transformer'
import { catchError, map, Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { Chat } from './chat.entity'
import * as forge from "node-forge"
import { AccountService } from '../account.service'

@Injectable({
    providedIn: 'root'
})
export class ChatsService {
    constructor(
        private readonly http: HttpClient,
        private readonly accountService: AccountService
    ) { }

    getChats(): Observable<Chat[]> {
        return this.http.get<Chat[]>(`http://${environment.apiHost}:${environment.apiPort}/v1/chat`)
            .pipe(
                catchError(_ => []),
                map(chats => plainToInstance(Chat, chats))
            )
    }

    getByChatId(chatId: string): Observable<Chat> {
        return this.http.get<Chat>(`http://${environment.apiHost}:${environment.apiPort}/v1/chat/${chatId}`)
            .pipe(
                map(chat => plainToInstance(Chat, chat))
            )
    }

    createChat(topicName: string): Observable<Chat> {
        const msg = {
            userId: this.accountService.currentUserId,
            name: topicName,
            userSignature: this.accountService.sign(`userId:${this.accountService.currentUserId};name:${topicName};`)
        }

        return this.http.post<Chat>(`http://${environment.apiHost}:${environment.apiPort}/v1/chat`, msg)
            .pipe(
                map(chat => plainToInstance(Chat, chat))
            )
    }
}
