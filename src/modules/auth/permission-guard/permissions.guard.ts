import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from '@nestjs/core'
import { matchPermissions } from '../../../common/helper/matchPermissions.helper'

@Injectable()
export class PermissionsGuard implements CanActivate {
	constructor(private reflector: Reflector) {}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const permissions = this.reflector.get<string[]>('permissions', context.getHandler())
		if (!permissions) {
			return true
		}
		const request = context.switchToHttp().getRequest()
		const user = request.user

		return matchPermissions(permissions, user.permissions)
	}
}
