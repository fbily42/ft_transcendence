import { IsNotEmpty, IsString } from 'class-validator';

export class NewPasswordDto {
	@IsNotEmpty()
	@IsString()
	readonly userId: string;

	@IsNotEmpty()
	@IsString()
	readonly channel: string;

	@IsString()
	@IsNotEmpty()
	readonly newPassword: string;
}
