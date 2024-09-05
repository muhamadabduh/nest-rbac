import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './modules/user/user.module'
import { AppConfigModule } from './config/app/config.module'
import { AuthModule } from './modules/auth/auth.module'

@Module({
	imports: [AppConfigModule, AuthModule, UserModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
