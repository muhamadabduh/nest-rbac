export const matchPermissions = (
	grantedPermissions: string[],
	availablePermissions: string[]
): boolean => {
	return grantedPermissions.some((permission) => availablePermissions.includes(permission))
}
