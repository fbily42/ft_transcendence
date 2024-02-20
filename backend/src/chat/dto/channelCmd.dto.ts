import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ChannelCmdDto {

	@IsNotEmpty()
	@IsString()
	readonly userId: string;

	@IsNotEmpty()
	@IsString()
	readonly targetId: string;

	@IsNotEmpty()
	@IsString()
	readonly targetName: string;

	@IsString()
	@IsNotEmpty()
	readonly channel: string;
}