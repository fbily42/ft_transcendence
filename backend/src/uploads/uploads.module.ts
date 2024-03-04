import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { ChatModule } from 'src/chat/chat.module';
import { AppGateway } from 'src/app.gateway';

@Module({
	imports: [ChatModule],
	controllers: [UploadsController],
	providers: [UploadsService, AppGateway],
})
export class UploadsModule {}