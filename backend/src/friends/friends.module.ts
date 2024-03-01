import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, UserService]
})
export class FriendsModule {}
