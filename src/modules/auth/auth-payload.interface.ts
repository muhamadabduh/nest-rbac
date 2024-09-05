/* content of payload inside JWT Access Token

This data shouldn't be exposed/accessed by controller/resolved directly. Instead it should be parsed & verified by AuthJwtGuard first, and then accessed via `../session-payload.interface.ts`.
*/
export interface AuthPayload {
	sub?: string
	sid: string
	name: string
}
