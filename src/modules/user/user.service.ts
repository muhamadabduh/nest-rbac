import { Injectable, Logger } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { MongoRepository } from 'typeorm'
import { KeycloakAdminService } from '../keycloak/keycloak-admin.service'
import { ObjectId } from 'mongodb'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: MongoRepository<User>,
		private readonly keycloakAdminService: KeycloakAdminService
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const { name, email, password, permissions } = createUserDto

		const newUser = new User()
		newUser.name = name
		newUser.email = email
		newUser.password = password
		await this.userRepository.save(newUser)
		// sync with keycloak
		const createdUser = await this.keycloakAdminService.createUser(
			name,
			email,
			password,
			newUser.id.toString()
		)

		// assign roles
		await this.keycloakAdminService.assignRole(createdUser.id, permissions)

		// save keycloak userId to DB
		await this.userRepository.updateOne(
			{ _id: new ObjectId(newUser.id) },
			{
				$set: {
					...newUser,
					authId: createdUser.id,
				},
			}
		)

		return newUser
	}

	async findAll() {
		const usersDb = await this.userRepository.find()
		return usersDb
	}

	async findOne(id: string) {
		try {
			const user = await this.userRepository.findOne({ where: { _id: new ObjectId(id) } })
			if (!user) {
				Logger.error('users not found')
				return
			}
			const { permissions } = await this.keycloakAdminService.findUser(user.authId)
			return {
				...user,
				permissions,
			}
		} catch (error) {
			Logger.error('error', error)
		}
	}

	async update(id: string, _updateUserDto: UpdateUserDto) {
		try {
			const { name, email, authId } = _updateUserDto

			// update to db
			await this.userRepository.updateOne({ _id: new ObjectId(id) }, { $set: { name, email } })

			// update to keycloak
			await this.keycloakAdminService.updateUser(authId, _updateUserDto)
			Logger.log('success update user', { userId: id, payload: _updateUserDto })
			return {
				message: 'success update user',
			}
		} catch (error) {
			Logger.error('error update user')
		}
	}

	async remove(id: string, authId: string) {
		// delete user from DB
		await this.userRepository.findOneAndDelete({ _id: new ObjectId(id) })
		// delete user from keycloak
		await this.keycloakAdminService.deleteUser(authId)
		return {
			message: 'success delete user',
		}
	}
}
