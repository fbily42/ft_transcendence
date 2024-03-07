import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class NewPasswordDto {
	@IsNotEmpty()
	@IsString()
	readonly userId: string;

	@IsNotEmpty()
	@IsString()
	readonly channel: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	@Matches(/^[a-zA-Z0-9!@#$%&*()_+\-=]*$/, {
		message: 'Password should only contain alphanumeric characters and the special characters : !@#$%^&*()_+-=',
	})
	readonly newPassword: string;
}
