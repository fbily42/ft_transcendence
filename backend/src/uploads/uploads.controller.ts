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
	async setProfile(
		@UploadedFile() file: Express.Multer.File,
		@Body('pseudo') pseudo: string,
		@Body('avatar') url: string,
		@Req() req: Request,
	) {
		try {
			if (!file && !url) {
				throw new HttpException(
					'Missing an avatar or a file',
					HttpStatus.BAD_REQUEST,
				);
			}
			return await this.uploadsService.setProfile(file, url, pseudo, req);
		} catch (error) {
			if (error instanceof HttpException)
				throw error
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

	}
}
