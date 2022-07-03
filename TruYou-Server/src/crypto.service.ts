import { Injectable } from "@nestjs/common"
import * as forge from "node-forge"
import { promises as fs } from "node:fs"

@Injectable()
export class CryptoService {
    private serverKey: forge.pki.rsa.PrivateKey | null = null

    constructor() { }

    private async getServerKey(): Promise<forge.pki.rsa.PrivateKey> {
        if (this.serverKey != null) {
            return this.serverKey
        }

        const serverKeyPem = await fs.readFile("server.key.pem")
        const serverKey = forge.pki.privateKeyFromPem(serverKeyPem.toString())
        this.serverKey = serverKey
        return serverKey
    }

    async signMessage(message: string): Promise<string> {
        const serverKey = await this.getServerKey()

        const md = forge.md.sha512.create()
        md.update(message, 'utf8')
        return forge.util.encode64(serverKey.sign(md))
    }

    verifyMessage(message: string, signature: string, certificate: forge.pki.Certificate) {
        return this.verifyMessageWithKey(message, signature, certificate.publicKey as forge.pki.rsa.PublicKey)
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

    async createUserCertificate(
        userId: string,
        userCreationDate: string,
        userPublicKey: forge.pki.rsa.PublicKey
    ): Promise<forge.pki.Certificate> {
        const cert = forge.pki.createCertificate()
        cert.publicKey = userPublicKey

        let serial = userId.replace("-", "")
        if (serial.startsWith("1")) {
            serial = "0" + serial
        }
        cert.serialNumber = serial

        cert.validity.notBefore = new Date(userCreationDate)
        cert.validity.notAfter = new Date(userCreationDate)
        cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 4)

        const subjectAttrs = [{
          name: 'commonName',
          value: userId
        }, {
          name: 'countryName',
          value: 'NL'
        }, {
          name: 'organizationName',
          value: 'Tru You'
        }, {
          shortName: 'OU',
          value: 'Tru You Users'
        }]
        cert.setSubject(subjectAttrs)

        cert.setIssuer(CryptoService.issuerAttrs)

        cert.setExtensions(CryptoService.userCertificateExtensions)

        const serverKey = await this.getServerKey()
        cert.sign(serverKey)

        return cert
    }

    static readonly issuerAttrs = [{
        name: 'commonName',
        value: "Tru You Root CA"
    }, {
        name: 'countryName',
        value: 'NL'
    }, {
        shortName: 'ST',
        value: 'Zuid-Holland'
    }, {
        name: 'localityName',
        value: 'Sliedrecht'
    }, {
        name: 'organizationName',
        value: 'Tru You'
    }, {
        shortName: 'OU',
        value: 'Tru You Root CA'
    }]

    static readonly userCertificateExtensions = [{
        name: 'basicConstraints',
        cA: true
    }, {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true
    }, {
        name: 'extKeyUsage',
        serverAuth: false,
        clientAuth: true,
        codeSigning: false,
        emailProtection: false,
        timeStamping: true
    }, {
        name: 'nsCertType',
        client: true,
        server: false,
        email: false,
        objsign: false,
        sslCA: false,
        emailCA: false,
        objCA: false
    }, {
        name: 'subjectKeyIdentifier'
    }]
}
