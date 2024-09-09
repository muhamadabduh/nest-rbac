// src/common/interfaces/response.interface.ts
export interface Response<T> {
	status: boolean
	message: string
	data?: T
}
