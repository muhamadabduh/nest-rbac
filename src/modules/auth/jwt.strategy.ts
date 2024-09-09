import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { SessionPayload, AuthPayload } from '../../common/interfaces/keycloak-user.interface'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private config: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken()]),
			ignoreExpiration: false,
			secretOrKey: config.get('keycloak.publicKey'),
		})
	}

	/* mandatory method from PassportJS.
  
  Validate jwt payload, then return object which will be stored by PassportJS inside 
  req.user property. In turn, values returned here would be available inside REST Controller 
  & Graphql Resolver using `@CurrentSession` param decorator. */
	async validate(payload: AuthPayload): Promise<SessionPayload> {
		const permissions = payload.realm_access.roles
		return {
			sid: payload.sid,
			userId: payload.sub,
			name: payload.name,
			permissions,
			email: payload.email,
		}
	}
}
