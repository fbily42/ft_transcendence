import {
	Body,
	Controller,
	HttpException,
	HttpStatus,
	Post,
	Req,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDto } from './uploads.dto';

@Controller('uploads')
@UseGuards(AuthGuard)
export class UploadsController {
	constructor(private uploadsService: UploadsService) {}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	uploadFile(
		@UploadedFile() file: Express.Multer.File,
		@Body('pseudo') pseudo: string,
		@Body('avatar') avatar: string,
		@Req() req: Request
	) {
		if (!file && !avatar) {
			throw new HttpException('Missing an avatar or a file', HttpStatus.BAD_REQUEST)
		}
		try {
			
		}
		catch(error){
			throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
		}

		console.log('FILE', file);
		console.log('PSEUDO', pseudo);
		console.log('AVATAR', avatar);
	}
}
