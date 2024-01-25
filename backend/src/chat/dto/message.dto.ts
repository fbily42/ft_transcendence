import { IsNotEmpty, IsString } from "class-validator";

export class MessageDto {
	
	@IsNotEmpty()
	@IsString()
	readonly user: string;

	@IsNotEmpty()
	@IsString()
	readonly target: string;

	@IsString()
	@IsNotEmpty()
	readonly message: string;
}