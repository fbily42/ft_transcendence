import { AchievementType } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class BadgeDTO {
	@IsEnum(AchievementType)
	@IsNotEmpty()
	chosenBadge: AchievementType; 
}