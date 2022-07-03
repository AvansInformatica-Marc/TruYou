import { AfterViewInit, Component } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { User } from "../users/user.entity"
import { UsersService } from "../users/users.service"
import { Chat } from "./chat.entity"
import { ChatsService } from "./chats.service"

@Component({
    selector: 'stream',
    templateUrl: './stream.component.html',
    styleUrls: ['./stream.component.scss']
})
export class StreamComponent implements AfterViewInit {
    chatId: string | null = null

    chat: Chat | undefined

    user: User | undefined

    constructor(
        private readonly route: ActivatedRoute,
        private readonly chatsService: ChatsService,
        private readonly usersService: UsersService
    ) { }

    ngAfterViewInit(): void {
        const routeParams = this.route.snapshot.paramMap
        this.chatId = routeParams.get('chatId')

        if (this.chatId) {
            this.chatsService.getByChatId(this.chatId).subscribe({
                next: response => {
                    this.chat = response

                    this.usersService.getUserById(response.userId).subscribe({
                        next: response => {
                            this.user = response
                        }
                    })
                }
            })
        }
    }
}
