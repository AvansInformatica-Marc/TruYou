import { HttpClient } from '@angular/common/http'
import { Injectable } from "@angular/core"
import { plainToInstance } from 'class-transformer'
import { catchError, map, Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { Message } from './message.entity'
import * as forge from "node-forge"
import { AccountService } from '../account.service'

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(
        private readonly http: HttpClient,
        private readonly accountService: AccountService
    ) { }

    getChat(chatId: string): Observable<Message[]> {
        return this.http.get<Message[]>(`http://${environment.apiHost}:${environment.apiPort}/v1/chat/${chatId}/messages`)
            .pipe(
                catchError(_ => []),
                map(message => plainToInstance(Message, message))
            )
    }

    getMessageById(chatId: string, messageId: string): Observable<Message> {
        return this.http.get<Message>(`http://${environment.apiHost}:${environment.apiPort}/v1/chat/${chatId}/messages/${messageId}`)
            .pipe(
                map(message => plainToInstance(Message, message))
            )
    }

    sendMessage(chatId: string, message: string): Observable<Message> {
        const signatureMessage = `chatId:${chatId};senderId:${this.accountService.currentUserId};message:${message};`
        const msg = {
            chatId,
            message,
            senderId: this.accountService.currentUserId,
            senderSignature: this.accountService.sign(signatureMessage)
        }

        return this.http.post<Message>(`http://${environment.apiHost}:${environment.apiPort}/v1/chat/${msg.chatId}/messages`, msg)
            .pipe(
                map(message => plainToInstance(Message, message))
            )
    }
}
