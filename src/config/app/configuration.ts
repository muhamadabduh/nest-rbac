import { config } from 'dotenv'
import { base64Decode } from '../../common/helper/base64.helper'

config()

export default () => ({
	app: {
		env: process.env.APP_ENV,
		port: process.env.APP_PORT,
		corsOrigins: process.env.CORS_ORIGINS,
	},
	keycloak: {
		url: process.env.KEYCLOAK_URL,
		realm: process.env.KEYCLOAK_REALM,
		adminClientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID,
		adminClientSecret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET,
		publicKey: base64Decode(process.env.KEYCLOAK_PUBLIC_KEY),
		grantType: process.env.KEYCLOAK_GRANT_TYPE,
	},
	redis: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		ttl: process.env.REDIS_TTL || 7200,
	},
})
