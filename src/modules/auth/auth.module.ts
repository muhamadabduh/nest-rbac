import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
import { JwtStrategy } from './jwt.strategy'
import { AuthJwtGuard } from './auth-jwt.guard'

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule,
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				publicKey: config.get('keycloak.publicKey'),
				verifyOptions: { algorithms: ['RS256'] },
			}),
		}),
	],
	providers: [JwtStrategy, AuthJwtGuard],
	exports: [JwtModule],
})
export class AuthModule {}
