import { HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class GameService{
	constructor(private prisma: PrismaService,
		private jwtService: JwtService,){}

		async confirmLogin(login: string)
		{
			try {
				await this.prisma.user.findUnique({
					where: {
						name: login,
					}
				})

			} catch(error)
			{
				throw new HttpException('Not found', 404);
			}
		}
}