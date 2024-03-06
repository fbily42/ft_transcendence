import { IsAlpha, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class FormDto {
	@IsString()
	@MinLength(2, {message: 'Pseudo must be at least 2 characters long'})
	@MaxLength(10, {message: 'Pseudo can not exceed 10 characters'})
	@IsAlpha('en-US', {message: 'Pseudo can only contain letters'})
	pseudo: string;

	@IsOptional()
	@IsString()
	avatar: string

}

