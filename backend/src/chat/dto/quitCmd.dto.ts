import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class quitCmdDto {
	@IsNotEmpty()
	@IsString()
	readonly user: string;

	@IsNotEmpty()
	@IsString()
	readonly channel: string;

	@IsNotEmpty()
	@IsString()
	readonly role: string;

	@IsOptional()
	@IsString()
	readonly newOwner: string;

	@IsBoolean()
	readonly alone: boolean;
}
