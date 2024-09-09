import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { SessionPayload } from '../../common/interfaces/keycloak-user.interface'

/* This is a param decorator for extracting "session" information stored in JWT payload. 
This decorator is intended to be used along with `AuthJwtGuard`. 
This decorator is usable for both REST API controllers or graphql resolvers.

Usage example:

```
  // REST Controller
  @UseGuards(AuthJwtGuard)
  @Get('me')
  async me(@CurrentSession() session: SessionPayload) {
    return session
  }

  // GraphQL Query Resolver
  @Query(() => User)
  @UseGuards(AuthJwtGuard)
  async me(@CurrentSession() session: SessionPayload): Promise<User> {
    return this.usersService.findOneBy({ nip: session.nip })
  }
```
*/
export const CurrentSession = createParamDecorator(
	(data: unknown, context: ExecutionContext): SessionPayload => {
		const req = context.switchToHttp().getRequest()
		req.user = req.user || {}
		req.user.httpRequest = {
			ip: req.headers['x-forwarded-for'] || req.ip,
			origin: req.headers.origin,
			user_agent: req.headers['user-agent'],
		}

		return req.user
	}
)
