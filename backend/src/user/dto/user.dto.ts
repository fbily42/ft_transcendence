import { AchievementType } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	photo42: string;
	avatar: string;
	name: string;
}

export class BadgeDTO {
	@IsEnum(AchievementType)
	@IsNotEmpty()
	chosenBadge: AchievementType; 
}