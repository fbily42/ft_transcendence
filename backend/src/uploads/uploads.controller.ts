import {
	Body,
	Controller,
	FileTypeValidator,
	HttpException,
	HttpStatus,
	ParseFilePipe,
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

	@UseInterceptors(
		FileInterceptor('file', { limits: { fieldSize: 25 * 1024 * 1024 } }),
	)
	@Post()
	async setProfile(
		@Body() formDto: FormDto,
		@UploadedFile(
			new ParseFilePipe({
				validators: [new FileTypeValidator({ fileType: 'image/svg' })],
				fileIsRequired: false,
			}),
		)
		file: Express.Multer.File,
		@Req() req: Request,
	) {
		try {
			if (!file && !formDto.avatar) {
				throw new HttpException(
					'Missing an avatar or a file',
					HttpStatus.BAD_REQUEST,
				);
			}
			return await this.uploadsService.setProfile(
				file,
				formDto.avatar,
				formDto.pseudo,
				req,
			);
		} catch (error) {
			if (error instanceof HttpException) throw error;
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
