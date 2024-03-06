import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class JoinChannelDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsString()
	@IsOptional()
	readonly password: string;
}
