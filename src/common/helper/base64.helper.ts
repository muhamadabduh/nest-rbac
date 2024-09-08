export const base64Decode = (base64EncodedString: string): string => {
	return Buffer.from(base64EncodedString, 'base64').toString()
}

export const base64Encode = (base64DecodedString: string): string => {
	return Buffer.from(base64DecodedString).toString('base64')
}
