import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LeaderboardDTO {
	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsNotEmpty()
	@IsNumber()
	readonly score: number;

	@IsNotEmpty()
	@IsNumber()
	readonly rank: number;
}
