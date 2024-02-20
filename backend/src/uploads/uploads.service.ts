import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable({})
export class UploadsService {
	constructor(private prisma: PrismaService) {}

	async setProfile(file: Express.Multer.File, url: string, pseudo: string, req: Request) {
		try{
			//check if pseudo already exists
			const pseudoExists : boolean = await this.pseudoExists(pseudo);
			if (pseudoExists){
				throw new HttpException('Pseudo already used', HttpStatus.CONFLICT)
			}

			//updates
			let avatar;
			if (file)
				avatar = file.buffer.toString('base64')
			else
				avatar = url

			const updatedUser: User = await this.prisma.user.update({
				where: {
					id: req['userID']
				},
				data: {
					avatar: avatar,
					pseudo: pseudo
				}
			})
		}
		catch(error){
			throw error
		}
	}

	async pseudoExists(pseudo: string) {
		try {
			const user: User = await this.prisma.user.findUnique({
				where:{
					pseudo: pseudo,
				}
			});
			if (user)
				return (true);
			else
				return (false)
		}
		catch(error) {
			throw error;
		}
	}
}