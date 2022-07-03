import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { UsersService } from '../users/users.service';
import { Chat } from './chat.entity';
import { ChatsService } from './chats.service';

@Component({
  selector: 'stream-list',
  templateUrl: './stream-list.component.html',
  styleUrls: ['./stream-list.component.scss']
})
export class ChatListComponent implements OnInit {
    public isLoading: boolean = true

    public chats: Chat[] = []

    names = new Map<string, string>()

    topicName = ""

    constructor(
        private readonly chatsService: ChatsService,
        private readonly usersService: UsersService,
        private readonly accountService: AccountService
    ) { }

    get isRegistered() {
        return this.accountService.isRegistered
    }

    ngOnInit(): void {
        this.updateChats()
    }

    updateChats() {
        this.chatsService.getChats().subscribe({
            next: chats => {
                this.isLoading = false
                this.chats = chats
                for (const chat of chats) {
                    this.names.set(chat.userId, chat.userId)
                    this.usersService.getUserById(chat.userId).subscribe({
                        next: user => {
                            this.names.set(chat.userId, user.name)
                        }
                    })
                }
            },
            error: _ => {
                this.isLoading = false
                this.chats = []
            }
        })
    }

    createChat() {
        const tmpTopicName = this.topicName
        this.topicName = "";
        this.chatsService.createChat(tmpTopicName).subscribe({
            next: _ => this.updateChats()
        })
    }

    logout() {
        this.accountService.logout()
    }
}
