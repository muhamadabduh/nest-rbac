import KeycloakAdminClient from '@keycloak/keycloak-admin-client'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cache } from 'cache-manager'
import { Response } from '../../common/interfaces/response.interface'
import { RoleMappingPayload } from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation'

@Injectable()
export class KeycloakAdminService {
	private keycloakAdmin: KeycloakAdminClient

	constructor(private config: ConfigService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {
		this.keycloakAdmin = new KeycloakAdminClient({
			baseUrl: config.get('keycloak.url'),
			realmName: config.get('keycloak.realm'),
		})

		this.initialize()
	}

	private async initialize() {
		const token = await this.getTokenFromCache()

		if (token) {
			this.keycloakAdmin.setAccessToken(token)
		} else {
			await this.refreshToken()
		}

		await this.keycloakAdmin.auth({
			grantType: this.config.get('keycloak.grantType'),
			clientId: this.config.get('keycloak.adminClientId'),
			clientSecret: this.config.get('keycloak.adminClientSecret'),
		})
	}

	// Method to create a user in Keycloak
	async createUser(username: string, email: string, password: string) {
		const newUser = await this.keycloakAdmin.users.create({
			realm: this.config.get('keycloak.realm'),
			username,
			email,
			enabled: true,
			credentials: [{ type: 'password', value: password, temporary: false }],
		})

		return newUser
	}

	private async getTokenFromCache(): Promise<string | null> {
		return this.cacheManager.get<string>('keycloak_access_token')
	}

	// Method to authenticate and refresh the token, then store it in cache
	private async refreshToken() {
		await this.keycloakAdmin.auth({
			grantType: this.config.get('keycloak.grantType'),
			clientId: this.config.get('keycloak.adminClientId'),
			clientSecret: this.config.get('keycloak.adminClientSecret'),
		})

		const token = await this.keycloakAdmin.getAccessToken()
		// const tokenInfo = await this.keycloakAdmin;

		// const expiresIn = tokenInfo.expires_in; // Get the token expiration time from the token response

		// Cache the token with a TTL slightly less than its actual expiry time
		await this.cacheManager.set('keycloak_access_token', token, 3600000)

		this.keycloakAdmin.setAccessToken(token)
	}

	// Method to assign roles to a user
	async assignRole(userId: string, roles: string[]) {
		const roleRepresentations = await this.keycloakAdmin.roles.find({
			realm: this.config.get('keycloak.realm'),
		})

		const rolesToAssign = roleRepresentations.filter((role) => roles.includes(role.name))
		const roleMappingPayload: RoleMappingPayload[] = rolesToAssign.map((role) => ({
			id: role.id,
			name: role.name,
		}))
		await this.keycloakAdmin.users.addRealmRoleMappings({
			id: userId,
			realm: this.config.get('keycloak.realm'),
			roles: roleMappingPayload,
		})
	}

	// Additional methods for other Keycloak admin tasks can be added here
	async getPermissions(name: string): Promise<Response<any>> {
		const roleRepresentations = await this.keycloakAdmin.roles.find({
			realm: this.config.get('keycloak.realm'),
			search: name,
		})

		return {
			status: true,
			message: 'success fetch permissions',
			data: roleRepresentations,
		}
	}
}
