import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from './configuration'
import { schema } from './config.schema'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [configuration],
			validationSchema: schema,
			expandVariables: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: 'mongodb',
				url: configService.get<string>('DATABASE_URL'),
				synchronize: true,
				entities: [User],
				logging: true,
			}),
		}),
	],
	providers: [ConfigService],
	exports: [ConfigService],
})
export class AppConfigModule {}
