import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { AuthJwtGuard } from '../auth/auth-jwt.guard'
import { Permissions } from '../auth/permission-guard/permissions.decorator'
import { PermissionsGuard } from '../auth/permission-guard/permissions.guard'
import { Permission } from 'src/common/enums/permissions.enum'
const { USER_CREATE, USER_VIEW } = Permission
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	@UseGuards(AuthJwtGuard, PermissionsGuard)
	@Permissions(USER_CREATE)
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.create(createUserDto)
	}

	@Get()
	@UseGuards(AuthJwtGuard, PermissionsGuard)
	@Permissions(USER_VIEW)
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
