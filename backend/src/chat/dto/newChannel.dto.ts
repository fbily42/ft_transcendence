import { IsBoolean, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class NewChannelDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(20)
	@MinLength(3)
	@Matches(/^[a-zA-Z0-9]*$/, {
		message: 'Name should only contain alphanumeric characters',
	})
	readonly name: string;

	@IsNotEmpty()
	@IsBoolean()
	readonly private: boolean;

	@IsString()
	@IsOptional()
	@MinLength(8)
	@Matches(/^[a-zA-Z0-9!@#$%&*()_+\-=]*$/, {
		message: 'Password should only contain alphanumeric characters and the special characters : !@#$%^&*()_+-=',
	})
	readonly password: string;
}
