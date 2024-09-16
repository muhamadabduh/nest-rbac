import { IsEmail, IsNotEmpty, MinLength, ArrayNotEmpty } from 'class-validator'

export class CreateUserDto {
	@IsNotEmpty()
	name: string

	@IsEmail()
	email: string

	@IsNotEmpty()
	@MinLength(6)
	password: string

	@ArrayNotEmpty()
	permissions: string[]
}
