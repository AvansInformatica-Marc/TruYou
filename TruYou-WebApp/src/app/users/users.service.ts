import { HttpClient } from '@angular/common/http'
import { Injectable } from "@angular/core"
import { plainToInstance } from 'class-transformer'
import { map, tap, of, Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { User } from './user.entity'
import { AccountService } from '../account.service'

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private usersCache = new Map<string, User>()

    constructor(
        private readonly http: HttpClient,
        private readonly accountService: AccountService
    ) { }

    getUserById(userId: string): Observable<User> {
        if (this.usersCache.has(userId)) {
            return of(this.usersCache.get(userId)!)
        }

        return this.http.get<User>(`http://${environment.apiHost}:${environment.apiPort}/v1/users/${userId}`)
            .pipe(
                map(user => plainToInstance(User, user)),
                tap(user => this.usersCache.set(userId, user))
            )
    }

    async register(userName: string): Promise<Observable<User>> {
        return (await this.accountService.register(userName)).pipe(
            tap(user => this.usersCache.set(user.userId, user))
        )
    }
}
