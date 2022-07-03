import { Test, TestingModule } from '@nestjs/testing'
import { UserReadDto } from './api/user-read.dto'
import { CryptoService } from './crypto.service'
import * as forge from "node-forge"

describe('CryptoService', () => {
    const serverKey = forge.pki.publicKeyFromPem(`-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA0fG0ZyXF/RFYxns4G58U
Bou/Y2JP5KNz+jLapwNsGjWHqgOfAyXqWQuIXA2lZCc9u/MVmFmjfbxzDTk6SX98
CfixtT5dUiQHWnKhLhOzv7rItqIckOoUfB4bP0QhhXdWE/ddfEfBtiMftv4wJAib
28JCZhKWl9o319CKxXBqlht0DAfB+yztQ3OCvnoTuhgNpmaAYs3C+woz0QSqEqLM
ClwUS8H9XdV/Lhw8+7gSnu/JUa2joaE/mKp6P6gTBWe/nhfscwEjgZiQISWv5Xuz
+jdWu0Mz9ykgaSmZ5R0GdHY5v/DvmDxlSR0Sj3E+UE9KnP2Lx8QX5xtC+3o0m6uP
g+gW304WnWpo43OfaCClW00VPufZBEd02SYcGD7RQCnZRLnAtk1qUyeLuzifPMm0
XfO07qBxlai1h2Tu3Ca6swVCdKaafSu/bygoMMsdFXz006G0mBKIvY8UTyi28WsE
K/NkpPu/wpojWn1mhDNi9fVZefCMEadD+lwomVStJjMvVdqWTfRdbT5Hh4T2V7xE
Ejw1w1qc47ukg6YZ3CeyTyQVW5ZRFctqkzBqWs8rj86JtSVWWM/azDUpH8G0PPJ3
4MB4HXtS+LfeC86IGLd0taTJ22pw4RVJLxpeNJQ4Oujs/Cqy587n/wkMmODF8Il/
11nirD4gF1jioLJL0jXFR50CAwEAAQ==
-----END PUBLIC KEY-----`)

    let service: CryptoService

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [],
            providers: [CryptoService]
        }).compile()

        service = app.get<CryptoService>(CryptoService)
    })

    describe('verification', () => {
        it('ST1) verifyMessageWithKey should return true when correct data is sent and returned', () => {
            // Arrange
            const user = new UserReadDto()
            user.userId = "659d6d70-c217-429d-8ddd-8fa485f4b15e"
            user.name = "Test 123"
            user.creationDate = "2022-07-03T12:34:41.553Z"
            user.publicKey = "-----BEGIN PUBLIC KEY-----\r\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAvoUzcrdKRmJEQWfospFi\r\ncLiKXg5+7bHDIF8XBisC/H3yWogzof7j9ndubLTGGg4i/X5ropYoMesUob0JxpMF\r\nTold00nJGvds8TbRlt/a61McYgZxOkwXV0egy442pbw593F6ohbOKPFFqSkRRhid\r\n+rd2HGrOYAz6xZWIDlKIrQYfizvrxwxIygPmRtTuECVRMM1/uATinssW5/3A6N7m\r\nJVKKCEd/2dAQkjwpHsIW+Ql0SWNRdl64w4xpEmWll/AnfLEiV2HAtv2vhm6ISZNM\r\nR4QiUkHVd+QoDKq7VTYIC9P6Nb137BBM/Gvpmahy7doZUTCN7hxxOgyRXxqPN6oY\r\n3ds3QEaj/izYBb3hWHedzmgLIVhxcAdpRlBeywESIwPASfEK5QULuxMPPFA4GIWF\r\n69ibWZgBNwpMxH+ReavKlloPgEIWWIflBFeI0grMdMrqQgSSqFrm/OARUiFJWr9U\r\nB8X7if18r+sIdPtJAqiJ/3KgYLeyp04GY+Gf9XEV7bblsdeHr6i9s9eJP2mtLdlm\r\n/KsXscOOphjNgAtPjIafkApnIBhZb9B8mP8u7qNiQIOOiYTBuq2kQMnGC1Yy1c0d\r\napsjBY9uiAJuUTshvbxIRqs5Qg9SCIcd+lk5NVT/+4/IrGbu3GPkFjt8agAhZGCx\r\nhvurDlbpA5F2Vwr/5qeReMECAwEAAQ==\r\n-----END PUBLIC KEY-----\r\n"
            user.certificate = "-----BEGIN CERTIFICATE-----\r\nMIIF3zCCA8egAwIBAgISBlnW1wwhB0KdN0Nj6SF9LFeMA0GCSqGSIb3DQEBBQUAM\r\nH8xGDAWBgNVBAMTD1RydSBZb3UgUm9vdCBDQTELMAkGA1UEBhMCTkwxFTATBgNVB\r\nAgTDFp1aWQtSG9sbGFuZDETMBEGA1UEBxMKU2xpZWRyZWNodDEQMA4GA1UEChMHV\r\nHJ1IFlvdTEYMBYGA1UECxMPVHJ1IFlvdSBSb290IENBMB4XDTIyMDcwMzEyMzQ0M\r\nVoXDTI2MDcwMzEyMzQ0MVowZjEtMCsGA1UEAxMkNjU5ZDZkNzAtYzIxNy00MjlkL\r\nThkZGQtOGZhNDg1ZjRiMTVlMQswCQYDVQQGEwJOTDEQMA4GA1UEChMHVHJ1IFlvd\r\nTEWMBQGA1UECxMNVHJ1IFlvdSBVc2VyczCCAiIwDQYJKoZIhvcNAQEBBQADggIPA\r\nDCCAgoCggIBAL6FM3K3SkZiREFn6LKRYnC4il4Ofu2xwyBfFwYrAvx98lqIM6H+4\r\n/Z3bmy0xhoOIv1+a6KWKDHrFKG9CcaTBU6JXdNJyRr3bPE20Zbf2utTHGIGcTpMF\r\n1dHoMuONqW8OfdxeqIWzijxRakpEUYYnfq3dhxqzmAM+sWViA5SiK0GH4s768cMS\r\nMoD5kbU7hAlUTDNf7gE4p7LFuf9wOje5iVSighHf9nQEJI8KR7CFvkJdEljUXZeu\r\nMOMaRJlpZfwJ3yxIldhwLb9r4ZuiEmTTEeEIlJB1XfkKAyqu1U2CAvT+jW9d+wQT\r\nPxr6Zmocu3aGVEwje4ccToMkV8ajzeqGN3bN0BGo/4s2AW94Vh3nc5oCyFYcXAHa\r\nUZQXssBEiMDwEnxCuUFC7sTDzxQOBiFhevYm1mYATcKTMR/kXmrypZaD4BCFliH5\r\nQRXiNIKzHTK6kIEkqha5vzgEVIhSVq/VAfF+4n9fK/rCHT7SQKoif9yoGC3sqdOB\r\nmPhn/VxFe225bHXh6+ovbPXiT9prS3ZZvyrF7HDjqYYzYALT4yGn5AKZyAYWW/Qf\r\nJj/Lu6jYkCDjomEwbqtpEDJxgtWMtXNHWqbIwWPbogCblE7Ib28SEarOUIPUgiHH\r\nfpZOTVU//uPyKxm7txj5BY7fGoAIWRgsYb7qw5W6QORdlcK/+ankXjBAgMBAAGjb\r\njBsMAwGA1UdEwQFMAMBAf8wCwYDVR0PBAQDAgL0MB0GA1UdJQQWMBQGCCsGAQUFB\r\nwMCBggrBgEFBQcDCDARBglghkgBhvhCAQEEBAMCB4AwHQYDVR0OBBYEFD5ZQyCdW\r\ncefEDwqX3u0WCp9gb9zMA0GCSqGSIb3DQEBBQUAA4ICAQDQgPSEtl2aHCie0O3i5\r\nObfQASJOGFzvGeZeTxGEdfdwkbXjyMs7W79XK89dOVBbmJUfNfxsQwVo34bk31Lj\r\n6pI26nJdUQSOXYHyy3h7+Y8RTeaek8kLipoaMVraJvY58/eZ9dvRBmRfPpaikEci\r\nc6AQpBkG94q46xrwKue36P+ySZkP0nCmkbk211dkbDvnhjKyPSC5ka2CoQGLvjjH\r\ntOn+QrksTghTh9Po3jpyjt2Bu+DMdCxu9W0p3DTlG4gx9aRxkYDQ2WJAqQoC+H1S\r\nbSigGIK4AMXjrBl5J3AbYtwNfvVLrNqMWL0e+n2iP2XtRHqN3C88oGDW2xxvDEzg\r\ncW3ldMgwyY16OucmugL6AsLbjXU8ud0nVTwHVkFo/q+9T6URSsmL8Vkq7Nf981Xy\r\nDoYXtXXAQLb8kBWM3yVaEkozFSsRxOZz/0EWuAfGhei0ANPcuAy1SyOq0SZ3ot2Y\r\n7aLpiV3zTNAr3ZrkBbhzUixMn1FoCb9iJADgAWAQe6YX+k+sMN/KmO/GncunQwfr\r\n8/fyjZPagiKYAzqgVKWf0prprL1ZlVfgMc0REEwnpGoI7NJZz3pz45+MrVpqKlbd\r\nQpVHvq9vPZCFXuFQPPhWm0d5+i3YaTQYLgGXdhNoi19hb/NhNKFlorhE09CvXDkP\r\nN5yjrOkQjzHcHW+Mst7oh3iMQ==\r\n-----END CERTIFICATE-----\r\n"
            user.userSignature = "lurx6oZeNQnku0um61mqMpDzZQ6XjEp15sCoSa9eYOtpBLRgUPWtL9GSMvnwvwAP1A4r/NTryDytoX1S8G7GLFJC3J0+TUk7s3Lk5of6jc7drcyF0oReuLzGXAOrdS0cAb56Az13zxhnAl8oOSMQYwAGSrzRBuhhzeurkIg/WVNABgBdXmnJiGxgWY27qj4KOsEP3PRBtQohDqbyRETCmxe82/sHdivrITQk8PeyY5qC8zuAWbkoYCERitUTL2j2MkWKEmh3klCHY35MXlGcgfiAu3+KakBB2zcBL2INMMwUKe+/6C4X9DdEfWyDC65527Epo1EnmvOasa+5fOq+ifEodelLHdlDOwaw8B/to4Msfwx8xVPMHvPVP5ob3xd1QTMuPHoyqACMambeDuTMqimN4XNmCleqsrv1LliE08JHc36pSBHo87t2Kj86jwi1Qk/Peo5QuRYkuudRNNiqZfyK7wR3XreP6vJ5YR6EVaYaw5sk+HL4SwH+9akWqhRfxn0Ztq0INqF4Ehr+iDEkFgVVynvCtssoyOh9TZJOq20AToRD4hC49HN5nu+wuLYsOX36q/WXpF9Z6dW59CdBD4sDbdYHMgzyN8RRJ1HzlyMywmJu3wVIvjfamCAN5oQWX3GlAWJQ29ghnE9X9vWzV+10bo/w2FVXzPPaerMsl30="
            user.serverSignature = "AX1XAQcDcHy392351htGE9Hoiam5lqz5qDXBkLlUya9i4n4kvV+Aqs2TuMQj0l17xrhk8/IB+H0Ymq5sbGjPkKZ30wnTuNFQsYTfDrSzZ2EQmbwVE0rih0oPWIWccs+CscxJD/wsP11rg1VY6omIA2pOQEuLtUylv82Pa9XDJMqbZqVlYiYwcnbDtjLIejJxwj0vPQeOvZ9ZBCjkk7AxhJWmcSabeQyedcKlv9O0Yebvl9C0iY+n5q6jwF2K+JnxifgGQm8WJJxCff9FVK/z4S/Yvc/EIHEuD/YMcYOS5JDjDUeccDEZU1McUuUQdjku06rFidYDclBFkEGYaY/Hpedh4en6ff0tFFrTCTvUtS1ixbLpWWDCxfhi4MvddKDbrJMfHgYkUGVj9j1NqUTEEpjLrW927dFEGCwX6cJ8nlYo5KuXnqgGT/2Gb8TlOhuu9A9qN2o3nNY8fKCR11NV2+wYL44jMSIzSwlemhhEwiFVW+MjVO9sDjFFE+Jm5POU7awf7wxGeFePQJDcG+1UNM3JVG9R72JOhdwmgvYIZrI/JVaLCkQ13GieUW2V3XdQqCDRvfN6yxbNYeTynNhbniTg3nYT81EwmAH7oMAGTJ1fGC697xgRVn/5ufMBSVpXsYeOvpN9FMEqJ6gozvYUdTXvpe5f0XrmHPvmxQp6AWU="
            const message = `userId:${user.userId};name:${user.name};creationDate:${user.creationDate};` +
                `publicKey:${user.publicKey.replace(/\r\n/g, "")};certificate:${user.certificate?.replace(/\r\n/g, "")};` +
                `userSignature:${user.userSignature};`

            // Act
            const verified = service.verifyMessageWithKey(message, user.serverSignature, serverKey)

            // Assert
            expect(verified).toEqual(true)
        })

        it('ST2) verifyMessageWithKey should return false when signature is incorrect', () => {
            // Arrange
            const user = new UserReadDto()
            user.userId = "659d6d70-c217-429d-8ddd-8fa485f4b15e"
            user.name = "Test 123"
            user.creationDate = "2022-07-03T12:34:41.553Z"
            user.publicKey = "-----BEGIN PUBLIC KEY-----\r\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAvoUzcrdKRmJEQWfospFi\r\ncLiKXg5+7bHDIF8XBisC/H3yWogzof7j9ndubLTGGg4i/X5ropYoMesUob0JxpMF\r\nTold00nJGvds8TbRlt/a61McYgZxOkwXV0egy442pbw593F6ohbOKPFFqSkRRhid\r\n+rd2HGrOYAz6xZWIDlKIrQYfizvrxwxIygPmRtTuECVRMM1/uATinssW5/3A6N7m\r\nJVKKCEd/2dAQkjwpHsIW+Ql0SWNRdl64w4xpEmWll/AnfLEiV2HAtv2vhm6ISZNM\r\nR4QiUkHVd+QoDKq7VTYIC9P6Nb137BBM/Gvpmahy7doZUTCN7hxxOgyRXxqPN6oY\r\n3ds3QEaj/izYBb3hWHedzmgLIVhxcAdpRlBeywESIwPASfEK5QULuxMPPFA4GIWF\r\n69ibWZgBNwpMxH+ReavKlloPgEIWWIflBFeI0grMdMrqQgSSqFrm/OARUiFJWr9U\r\nB8X7if18r+sIdPtJAqiJ/3KgYLeyp04GY+Gf9XEV7bblsdeHr6i9s9eJP2mtLdlm\r\n/KsXscOOphjNgAtPjIafkApnIBhZb9B8mP8u7qNiQIOOiYTBuq2kQMnGC1Yy1c0d\r\napsjBY9uiAJuUTshvbxIRqs5Qg9SCIcd+lk5NVT/+4/IrGbu3GPkFjt8agAhZGCx\r\nhvurDlbpA5F2Vwr/5qeReMECAwEAAQ==\r\n-----END PUBLIC KEY-----\r\n"
            user.certificate = "-----BEGIN CERTIFICATE-----\r\n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\r\nN5yjrOkQjzHcHW+Mst7oh3iMQ==\r\n-----END CERTIFICATE-----\r\n"
            user.userSignature = "lurx6oZeNQnku0um61mqMpDzZQ6XjEp15sCoSa9eYOtpBLRgUPWtL9GSMvnwvwAP1A4r/NTryDytoX1S8G7GLFJC3J0+TUk7s3Lk5of6jc7drcyF0oReuLzGXAOrdS0cAb56Az13zxhnAl8oOSMQYwAGSrzRBuhhzeurkIg/WVNABgBdXmnJiGxgWY27qj4KOsEP3PRBtQohDqbyRETCmxe82/sHdivrITQk8PeyY5qC8zuAWbkoYCERitUTL2j2MkWKEmh3klCHY35MXlGcgfiAu3+KakBB2zcBL2INMMwUKe+/6C4X9DdEfWyDC65527Epo1EnmvOasa+5fOq+ifEodelLHdlDOwaw8B/to4Msfwx8xVPMHvPVP5ob3xd1QTMuPHoyqACMambeDuTMqimN4XNmCleqsrv1LliE08JHc36pSBHo87t2Kj86jwi1Qk/Peo5QuRYkuudRNNiqZfyK7wR3XreP6vJ5YR6EVaYaw5sk+HL4SwH+9akWqhRfxn0Ztq0INqF4Ehr+iDEkFgVVynvCtssoyOh9TZJOq20AToRD4hC49HN5nu+wuLYsOX36q/WXpF9Z6dW59CdBD4sDbdYHMgzyN8RRJ1HzlyMywmJu3wVIvjfamCAN5oQWX3GlAWJQ29ghnE9X9vWzV+10bo/w2FVXzPPaerMsl30="
            user.serverSignature = "BX1XAQcDcHy392351htGE9Hoiam5lqz5qDXBkLlUya9i4n4kvV+Aqs2TuMQj0l17xrhk8/IB+H0Ymq5sbGjPkKZ30wnTuNFQsYTfDrSzZ2EQmbwVE0rih0oPWIWccs+CscxJD/wsP11rg1VY6omIA2pOQEuLtUylv82Pa9XDJMqbZqVlYiYwcnbDtjLIejJxwj0vPQeOvZ9ZBCjkk7AxhJWmcSabeQyedcKlv9O0Yebvl9C0iY+n5q6jwF2K+JnxifgGQm8WJJxCff9FVK/z4S/Yvc/EIHEuD/YMcYOS5JDjDUeccDEZU1McUuUQdjku06rFidYDclBFkEGYaY/Hpedh4en6ff0tFFrTCTvUtS1ixbLpWWDCxfhi4MvddKDbrJMfHgYkUGVj9j1NqUTEEpjLrW927dFEGCwX6cJ8nlYo5KuXnqgGT/2Gb8TlOhuu9A9qN2o3nNY8fKCR11NV2+wYL44jMSIzSwlemhhEwiFVW+MjVO9sDjFFE+Jm5POU7awf7wxGeFePQJDcG+1UNM3JVG9R72JOhdwmgvYIZrI/JVaLCkQ13GieUW2V3XdQqCDRvfN6yxbNYeTynNhbniTg3nYT81EwmAH7oMAGTJ1fGC697xgRVn/5ufMBSVpXsYeOvpN9FMEqJ6gozvYUdTXvpe5f0XrmHPvmxQp6AWU="
            const message = `userId:${user.userId};name:${user.name};creationDate:${user.creationDate};` +
                `publicKey:${user.publicKey.replace(/\r\n/g, "")};certificate:${user.certificate?.replace(/\r\n/g, "")};` +
                `userSignature:${user.userSignature};`

            // Act
            const verified = service.verifyMessageWithKey(message, user.serverSignature, serverKey)

            // Assert
            expect(verified).toEqual(false)
        })

        it('ST3) verifyMessageWithKey should return false when body was modified', () => {
            // Arrange
            const user = new UserReadDto()
            user.userId = "659d6d70-c217-429d-8ddd-8fa485f4b15e"
            user.name = "Test 321"
            user.creationDate = "2022-07-03T12:34:41.553Z"
            user.publicKey = "-----BEGIN PUBLIC KEY-----\r\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAvoUzcrdKRmJEQWfospFi\r\ncLiKXg5+7bHDIF8XBisC/H3yWogzof7j9ndubLTGGg4i/X5ropYoMesUob0JxpMF\r\nTold00nJGvds8TbRlt/a61McYgZxOkwXV0egy442pbw593F6ohbOKPFFqSkRRhid\r\n+rd2HGrOYAz6xZWIDlKIrQYfizvrxwxIygPmRtTuECVRMM1/uATinssW5/3A6N7m\r\nJVKKCEd/2dAQkjwpHsIW+Ql0SWNRdl64w4xpEmWll/AnfLEiV2HAtv2vhm6ISZNM\r\nR4QiUkHVd+QoDKq7VTYIC9P6Nb137BBM/Gvpmahy7doZUTCN7hxxOgyRXxqPN6oY\r\n3ds3QEaj/izYBb3hWHedzmgLIVhxcAdpRlBeywESIwPASfEK5QULuxMPPFA4GIWF\r\n69ibWZgBNwpMxH+ReavKlloPgEIWWIflBFeI0grMdMrqQgSSqFrm/OARUiFJWr9U\r\nB8X7if18r+sIdPtJAqiJ/3KgYLeyp04GY+Gf9XEV7bblsdeHr6i9s9eJP2mtLdlm\r\n/KsXscOOphjNgAtPjIafkApnIBhZb9B8mP8u7qNiQIOOiYTBuq2kQMnGC1Yy1c0d\r\napsjBY9uiAJuUTshvbxIRqs5Qg9SCIcd+lk5NVT/+4/IrGbu3GPkFjt8agAhZGCx\r\nhvurDlbpA5F2Vwr/5qeReMECAwEAAQ==\r\n-----END PUBLIC KEY-----\r\n"
            user.certificate = "-----BEGIN CERTIFICATE-----\r\n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\r\nN5yjrOkQjzHcHW+Mst7oh3iMQ==\r\n-----END CERTIFICATE-----\r\n"
            user.userSignature = "lurx6oZeNQnku0um61mqMpDzZQ6XjEp15sCoSa9eYOtpBLRgUPWtL9GSMvnwvwAP1A4r/NTryDytoX1S8G7GLFJC3J0+TUk7s3Lk5of6jc7drcyF0oReuLzGXAOrdS0cAb56Az13zxhnAl8oOSMQYwAGSrzRBuhhzeurkIg/WVNABgBdXmnJiGxgWY27qj4KOsEP3PRBtQohDqbyRETCmxe82/sHdivrITQk8PeyY5qC8zuAWbkoYCERitUTL2j2MkWKEmh3klCHY35MXlGcgfiAu3+KakBB2zcBL2INMMwUKe+/6C4X9DdEfWyDC65527Epo1EnmvOasa+5fOq+ifEodelLHdlDOwaw8B/to4Msfwx8xVPMHvPVP5ob3xd1QTMuPHoyqACMambeDuTMqimN4XNmCleqsrv1LliE08JHc36pSBHo87t2Kj86jwi1Qk/Peo5QuRYkuudRNNiqZfyK7wR3XreP6vJ5YR6EVaYaw5sk+HL4SwH+9akWqhRfxn0Ztq0INqF4Ehr+iDEkFgVVynvCtssoyOh9TZJOq20AToRD4hC49HN5nu+wuLYsOX36q/WXpF9Z6dW59CdBD4sDbdYHMgzyN8RRJ1HzlyMywmJu3wVIvjfamCAN5oQWX3GlAWJQ29ghnE9X9vWzV+10bo/w2FVXzPPaerMsl30="
            user.serverSignature = "AX1XAQcDcHy392351htGE9Hoiam5lqz5qDXBkLlUya9i4n4kvV+Aqs2TuMQj0l17xrhk8/IB+H0Ymq5sbGjPkKZ30wnTuNFQsYTfDrSzZ2EQmbwVE0rih0oPWIWccs+CscxJD/wsP11rg1VY6omIA2pOQEuLtUylv82Pa9XDJMqbZqVlYiYwcnbDtjLIejJxwj0vPQeOvZ9ZBCjkk7AxhJWmcSabeQyedcKlv9O0Yebvl9C0iY+n5q6jwF2K+JnxifgGQm8WJJxCff9FVK/z4S/Yvc/EIHEuD/YMcYOS5JDjDUeccDEZU1McUuUQdjku06rFidYDclBFkEGYaY/Hpedh4en6ff0tFFrTCTvUtS1ixbLpWWDCxfhi4MvddKDbrJMfHgYkUGVj9j1NqUTEEpjLrW927dFEGCwX6cJ8nlYo5KuXnqgGT/2Gb8TlOhuu9A9qN2o3nNY8fKCR11NV2+wYL44jMSIzSwlemhhEwiFVW+MjVO9sDjFFE+Jm5POU7awf7wxGeFePQJDcG+1UNM3JVG9R72JOhdwmgvYIZrI/JVaLCkQ13GieUW2V3XdQqCDRvfN6yxbNYeTynNhbniTg3nYT81EwmAH7oMAGTJ1fGC697xgRVn/5ufMBSVpXsYeOvpN9FMEqJ6gozvYUdTXvpe5f0XrmHPvmxQp6AWU="
            const message = `userId:${user.userId};name:${user.name};creationDate:${user.creationDate};` +
                `publicKey:${user.publicKey.replace(/\r\n/g, "")};certificate:${user.certificate?.replace(/\r\n/g, "")};` +
                `userSignature:${user.userSignature};`

            // Act
            const verified = service.verifyMessageWithKey(message, user.serverSignature, serverKey)

            // Assert
            expect(verified).toEqual(false)
        })
    })
})
