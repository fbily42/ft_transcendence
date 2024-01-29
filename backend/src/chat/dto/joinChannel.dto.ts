import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class JoinChannelDto{

	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsString()
	@IsOptional()
	readonly password: string;
}