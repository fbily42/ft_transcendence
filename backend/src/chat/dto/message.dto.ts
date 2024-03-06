import { IsNotEmpty, IsString } from 'class-validator';

export class MessageDto {
	@IsNotEmpty()
	@IsString()
	readonly userId: string;

	@IsNotEmpty()
	@IsString()
	readonly userName: string;

	@IsNotEmpty()
	@IsString()
	readonly target: string;

	@IsString()
	@IsNotEmpty()
	readonly message: string;
}
