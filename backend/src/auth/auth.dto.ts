import { IsInt, IsNumberString, IsString } from "class-validator";

export class OtpDto {
	@IsString()
	token: string;

	@IsNumberString()
	id: string;
  }