import { IsInt, IsNumberString, IsString } from "class-validator";

export class OtpDto {
	@IsString()
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
	token: string;
}