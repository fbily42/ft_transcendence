import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MessageDto {
	
	@IsNotEmpty()
	@IsNumber()
	readonly userId: number

	@IsNotEmpty()
	@IsString()
	readonly userName: string;

	@IsNotEmpty()
	@IsString()
	readonly target: string;

	@IsString()
	@IsNotEmpty()
	readonly message: string;
}