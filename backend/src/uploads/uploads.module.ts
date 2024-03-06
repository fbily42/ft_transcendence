import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { ChatModule } from 'src/chat/chat.module';
import { AppGateway } from 'src/app.gateway';
import { AppModule } from 'src/app.module';

@Module({
	controllers: [UploadsController],
	providers: [UploadsService],
})
export class UploadsModule {}