import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ChatListComponent } from './streaming/stream-list.component'
import { StreamComponent } from './streaming/stream.component'
import { RegisterComponent } from './users/register.component'

const routes: Routes = [
    { path: '', component: ChatListComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'chats/:chatId', component: StreamComponent }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
