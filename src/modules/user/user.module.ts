import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { KeycloakModule } from '../keycloak/keycloak-admin.module'
import { KeycloakAdminService } from '../keycloak/keycloak-admin.service'

@Module({
	imports: [ConfigModule, KeycloakModule, TypeOrmModule.forFeature([User])],
	controllers: [UserController],
	providers: [UserService, KeycloakAdminService],
})
export class UserModule {}
