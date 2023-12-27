import { IsNotEmpty, IsString } from "class-validator"

export class UserDto {

	@IsString()
	@IsNotEmpty()
	name: string

	@IsString()
	@IsNotEmpty()
	hash: string

	@IsString()
	@IsNotEmpty()
	tokenAuth: string

	@IsString()
	@IsNotEmpty()
	status: string
}