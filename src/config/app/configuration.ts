import { config } from 'dotenv'

config()

export default () => ({
	app: {
		env: process.env.APP_ENV,
		port: process.env.APP_PORT,
	},
	keycloak: {
		url: process.env.KEYCLOAK_URL,
		realm: process.env.KEYCLOAK_REALM,
		adminClientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID,
		adminClientSecret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET,
		webClientId: process.env.KEYCLOAK_WEB_CLIENT_ID,
		webClientSecret: process.env.KEYCLOAK_WEB_CLIENT_SECRET,
		grantType: process.env.KEYCLOAK_GRANT_TYPE,
	},
	redis: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
		password: process.env.REDIS_PASSWORD,
		ttl: process.env.REDIS_TTL || 7200,
	},
})
