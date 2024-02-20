import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TargetDto {
	
	@IsNotEmpty()
	@IsString()
	readonly name: string;

}