import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthJwtGuard } from '../auth/auth-jwt.guard'

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@UseGuards(AuthJwtGuard)
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto)
	}

	@Get()
	@UseGuards(AuthJwtGuard)
	findAll() {
		return this.userService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.findOne(+id)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.update(+id, updateUserDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.remove(+id)
	}
}
