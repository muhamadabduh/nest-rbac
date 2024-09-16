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
		const createdUser = await this.keycloakAdminService.createUser(name, email, password)

		// assign roles
		await this.keycloakAdminService.assignRole(createdUser.id, permissions)

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
			}
			return user
		} catch (error) {
			Logger.error('error', error)
		}
	}

	update(id: string, _updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`
	}

	async remove(id: string, email: string) {
		// delete user from DB
		await this.userRepository.findOneAndDelete({ _id: new ObjectId(id) })
		// delete user from keycloak
		await this.keycloakAdminService.deleteUser(email)
		return {
			message: 'success delete user',
		}
	}
}
