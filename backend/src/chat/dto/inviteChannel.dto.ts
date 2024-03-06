import { IsNotEmpty, IsString } from 'class-validator';

export class InviteChannelDto {
	@IsNotEmpty()
	@IsString()
	readonly sentBy: string;

	@IsNotEmpty()
	@IsString()
	readonly name: string;

	@IsString()
	@IsNotEmpty()
	readonly channel: string;
}
