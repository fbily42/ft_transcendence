import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { GameModule } from './game/game.module';
import { UploadsModule } from './uploads/uploads.module';
import { FriendsModule } from './friends/friends.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		AuthModule,
		UserModule,
		PrismaModule,
		ChatModule,
		GameModule,
		UploadsModule
		FriendsModule,
	],
})
export class AppModule {}
