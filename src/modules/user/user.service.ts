import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../../entities/user.entity'
import { MongoRepository } from 'typeorm'
import { KeycloakAdminService } from '../keycloak/keycloak-admin.service'

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: MongoRepository<User>,
		private readonly keycloakAdminService: KeycloakAdminService
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		const { name, email, password, roles } = createUserDto

		const newUser = new User()
		newUser.name = name
		newUser.email = email
		newUser.password = password
		await this.userRepository.save(newUser)
		// sync with keycloak
		const createdUser = await this.keycloakAdminService.createUser(name, email, password)

		// assign roles
		await this.keycloakAdminService.assignRole(createdUser.id, roles)

		return newUser
	}

	findAll() {
		return this.userRepository.find()
	}

	findOne(id: number) {
		return `This action returns a #${id} user`
	}

	update(id: number, _updateUserDto: UpdateUserDto) {
		return `This action updates a #${id} user`
	}

	remove(id: number) {
		return `This action removes a #${id} user`
	}
}
