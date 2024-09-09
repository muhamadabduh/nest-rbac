import { Module } from '@nestjs/common'
import { KeycloakAdminService } from './keycloak-admin.service'
import { CacheConfigModule } from 'src/config/cache/config.module'
import { KeycloakAdminController } from './keycloak-admin.controller'

@Module({
	imports: [CacheConfigModule],
	providers: [KeycloakAdminService],
	exports: [KeycloakAdminService],
	controllers: [KeycloakAdminController],
})
export class KeycloakModule {}
