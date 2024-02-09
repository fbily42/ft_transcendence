import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	photo42: string;
	avatar: string;
	name: string;
}
