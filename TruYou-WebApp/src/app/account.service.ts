import { HttpClient } from '@angular/common/http'
import { Injectable } from "@angular/core"
import { plainToInstance } from 'class-transformer'
import { map, tap, Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { User } from './users/user.entity'
import * as forge from "node-forge"

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    isRegistered = !!localStorage["userId"]

    private cachedPrivateKey: forge.pki.rsa.PrivateKey | null = null

    constructor(private readonly http: HttpClient) { }

    get currentUserId(): string {
        return localStorage["userId"] ?? ""
    }

    async register(userName: string): Promise<Observable<User>> {
        const keyPair = await this.createKeyPair()
        const publicKey = forge.pki.publicKeyToPem(keyPair.publicKey)
        const message = `name:${userName};publicKey:${publicKey.replace(/\r\n/g, "")};`
        const body = {
            name: userName,
            publicKey: publicKey,
            userSignature: this.signWithKey(message, keyPair.privateKey)
        }

        return this.http.post<User>(`http://${environment.apiHost}:${environment.apiPort}/v1/users/`, body)
            .pipe(
                map(user => plainToInstance(User, user)),
                tap(user => {
                    const verified = this.verifyRegistrationResponse(user, body)
                    if (verified) {
                        localStorage["userId"] = user.userId
                        localStorage["userName"] = user.name
                        localStorage["privateKey"] = forge.pki.privateKeyToPem(keyPair.privateKey)
                        this.cachedPrivateKey = keyPair.privateKey
                        this.isRegistered = true
                    }
                })
            )
    }

    verifyRegistrationResponse(user: User, body: { name: string, publicKey: string, userSignature: string }): boolean {
        const serverKey = forge.pki.publicKeyFromPem(environment.serverKey)
        const message = `userId:${user.userId};name:${user.name};creationDate:${user.creationDate};` +
            `publicKey:${user.publicKey.replace(/\r\n/g, "")};certificate:${user.certificate?.replace(/\r\n/g, "")};` +
            `userSignature:${user.userSignature};`
        const hasOriginalData = body.name == user.name && user.publicKey == body.publicKey && body.userSignature == user.userSignature
        const isSignatureVerified = this.verifyMessageWithKey(message, user.serverSignature, serverKey)

        if (!isSignatureVerified) {
            console.warn("AccountService: Invalid signature")
        }

        if (!hasOriginalData) {
            console.warn("AccountService: Modified body")
        }

        return isSignatureVerified && hasOriginalData
    }

    logout() {
        localStorage.removeItem("userId")
        localStorage.removeItem("userName")
        localStorage.removeItem("privateKey")
        this.cachedPrivateKey = null
        this.isRegistered = false
    }

    verifyMessageWithKey(message: string, signature: string, publicKey: forge.pki.rsa.PublicKey) {
        try {
            const md = forge.md.sha512.create()
            md.update(message, 'utf8')
            return publicKey.verify(md.digest().bytes(), forge.util.decode64(signature))
        } catch (verificationError) {
            return false
        }
    }

    sign(message: string): string {
        return this.signWithKey(message, this.loadPrivateKey())
    }

    private loadPrivateKey(): forge.pki.rsa.PrivateKey {
        if (this.cachedPrivateKey != null) {
            return this.cachedPrivateKey
        }

        const privateKey = forge.pki.privateKeyFromPem(localStorage["privateKey"])
        this.cachedPrivateKey = privateKey
        return privateKey
    }

    private signWithKey(message: string, privateKey: forge.pki.rsa.PrivateKey): string {
        const md = forge.md.sha512.create()
        md.update(message, 'utf8')
        return forge.util.encode64(privateKey.sign(md))
    }

    private createKeyPair(): Promise<forge.pki.rsa.KeyPair> {
        return new Promise((resolve, reject) => {
            forge.pki.rsa.generateKeyPair({bits: 4096, workers: -1}, (error, keyPair) => {
                if (keyPair) {
                    resolve(keyPair)
                } else {
                    reject(error)
                }
            })
        })
    }
}
