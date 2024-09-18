import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { corsOptions } from './config/cors.config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config: ConfigService = app.get(ConfigService)

	app.enableCors(corsOptions(config))
	app.useGlobalPipes(new ValidationPipe())
	await app.listen(3000)
}
bootstrap()
