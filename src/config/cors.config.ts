import { ForbiddenException } from '@nestjs/common'
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface'
import { ConfigService } from '@nestjs/config'

export function corsOptions(configService: ConfigService): CorsOptions {
	const allowedCorsOrigins = configService.get('app.corsOrigins')

	return allowedCorsOrigins
		? {
				origin: (origin, callback) => {
					// origin could be undefined or null when called directly in browser (via url, not via AJAX). This is the case on auth URL which relied on redirects. In other case, origin is guaranteed to be filled by browser so we could check the value to protect from CORS attacks
					if (
						!origin ||
						origin == 'null' ||
						allowedCorsOrigins.some((value) => origin.includes(value))
					) {
						callback(null, true)
					} else {
						callback(new ForbiddenException('CORS Error'))
					}
				},

				credentials: true,
		  }
		: {}
}
