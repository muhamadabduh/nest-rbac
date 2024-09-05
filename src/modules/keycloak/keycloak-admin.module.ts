import { Module } from '@nestjs/common'
import { KeycloakAdminService } from './keycloak-admin.service'
import { CacheConfigModule } from 'src/config/cache/config.module'

@Module({
	imports: [CacheConfigModule],
	providers: [KeycloakAdminService],
	exports: [KeycloakAdminService],
})
export class KeycloakModule {}
