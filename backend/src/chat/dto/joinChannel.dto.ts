import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class JoinChannelDto{

	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	readonly password: string;
}