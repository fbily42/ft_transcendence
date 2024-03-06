import { IsNumberString, IsString, MaxLength, MinLength } from "class-validator";

export class OtpDto {
	@IsString()
	@IsNumberString()
	@MinLength(6)
	@MaxLength(6)
	token: string;

	@IsString()
	uuid: string;
}

export class UuidDto {
	@IsString()
	uuid: string;
}

export class TokenDto {
	@IsString()
	@IsNumberString()
	@MinLength(6)
	@MaxLength(6)
	token: string;
}