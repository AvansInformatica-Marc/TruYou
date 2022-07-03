import { ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as compression from 'compression'
import helmet from 'helmet'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { validationOptions } from './app.constants'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.useGlobalPipes(new ValidationPipe(validationOptions))

    app.enableVersioning({
        type: VersioningType.URI
    })

    app.enableCors()

    app.use(compression())

    app.use(helmet())

    const config = new DocumentBuilder()
        .setTitle('Tru You')
        .setDescription('Tru You API')
        .setVersion('1')
        .addTag("users")
        .addTag("chat")
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('', app, document)

    await app.listen(3000)
}

bootstrap()
