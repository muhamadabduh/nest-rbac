import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { KeycloakAdminService } from './keycloak-admin.service'
import { AuthJwtGuard } from '../auth/auth-jwt.guard'
import { PermissionsGuard } from '../auth/permission-guard/permissions.guard'
import { Permission } from 'src/common/enums/permissions.enum'
import { Permissions } from '../auth/permission-guard/permissions.decorator'
const { PERMISSION_VIEW } = Permission

@Controller('admin')
export class KeycloakAdminController {
	constructor(private readonly keycloakAdminService: KeycloakAdminService) {}

	@Get('permissions')
	@UseGuards(AuthJwtGuard, PermissionsGuard)
	@Permissions(PERMISSION_VIEW)
	async getPermissions(@Query('name') name: string) {
		return this.keycloakAdminService.getPermissions(name)
	}
}
