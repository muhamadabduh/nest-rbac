export interface AuthPayload {
	realm_access: RealmAccess
	name: string
	email: string
	sub?: string
	sid: string
}

export interface RealmAccess {
	roles: string[]
}

export interface SessionPayload {
	sid: string
	userId: string
	name: string
	email: string
	permissions?: string[] // permissions here are roles in keycloak
}
