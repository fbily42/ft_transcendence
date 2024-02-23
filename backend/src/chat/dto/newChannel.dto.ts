import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class NewChannelDto {
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsNotEmpty()
	@IsBoolean()
	readonly private: boolean;

	@IsString()
	@IsOptional()
	readonly password: string;
}
