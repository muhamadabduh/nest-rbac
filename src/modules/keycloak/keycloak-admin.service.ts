import KeycloakAdminClient from '@keycloak/keycloak-admin-client'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cache } from 'cache-manager'
import { Response } from '../../common/interfaces/response.interface'
import { RoleMappingPayload } from '@keycloak/keycloak-admin-client/lib/defs/roleRepresentation'
import { UpdateUserDto } from '../user/dto/update-user.dto'

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

	async findAll() {
		const users = await this.keycloakAdmin.users.find()
		return users
	}

	// Method to create a user in Keycloak
	async createUser(username: string, email: string, password: string, user_id: string) {
		const newUser = await this.keycloakAdmin.users.create({
			realm: this.config.get('keycloak.realm'),
			username,
			email,
			enabled: true,
			firstName: username,
			credentials: [{ type: 'password', value: password, temporary: false }],
			attributes: {
				user_id,
			},
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

	async deleteUser(authId: string) {
		await this.keycloakAdmin.users.del({ id: authId })
	}

	async findUser(authId: string) {
		const user = await this.keycloakAdmin.users.findOne({ id: authId })
		const userPermissions = await this.keycloakAdmin.users.listRealmRoleMappings({
			id: user.id,
		})
		const permissions = userPermissions.filter((permission) => permission.name.includes('rbac'))
		return {
			user: user,
			permissions,
		}
	}

	// update user without changing credentials
	async updateUser(authId: string, _updateUserDto: UpdateUserDto) {
		// update name and email
		await this.keycloakAdmin.users.update(
			{ id: authId },
			{
				firstName: _updateUserDto.name,
				email: _updateUserDto.email,
			}
		)

		// Next Todo sync permissions
		// const initialPermissions = await this.keycloakAdmin.users.listRealmRoleMappings({ id: authId })
		// const upcomingPermissions = _updateUserDto.permissions
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
