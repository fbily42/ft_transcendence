import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ChannelDto {
	
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsNotEmpty()
	@IsBoolean()
	readonly private: boolean;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	readonly password: string;
}