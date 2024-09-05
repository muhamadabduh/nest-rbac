import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class AuthJwtGuard extends AuthGuard('jwt') {
	getRequest(context: ExecutionContext) {
		return context.switchToHttp().getRequest()
	}

	handleRequest<User>(err: any, user: any, info: any, context: ExecutionContext): User {
		const request = this.getRequest(context)
		const session: any = {
			...user,
			httpRequest: {
				ip: request.headers['x-forwarded-for'] || request.ip,
				origin: request.headers['origin'],
				user_agent: request.headers['user-agent'],
			},
		}

		if (err || info || !user) {
			if (info instanceof Error) {
				if (info.name === 'TokenExpiredError') {
					Logger.log('token expired', {
						error: info,
					})
				}
				throw new UnauthorizedException(info.message, { cause: new Error(info.message) })
			}

			Logger.log('token error', session)
			throw new UnauthorizedException()
		}

		return user
	}
}
