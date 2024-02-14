import { Controller, Post, UseGuards } from "@nestjs/common";
import { UploadsService } from "./uploads.service";
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('uploads')
@UseGuards(AuthGuard)
export class UploadsController {
	constructor(private uploadsService: UploadsService) {}

	@Post()
	async uploadImage() {
		
	}
}