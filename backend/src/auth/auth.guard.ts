import {
	Injectable,
	CanActivate,
	ExecutionContext,
	Redirect,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private prisma: PrismaService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();

		const encodedJwt: string = request.cookies.jwt;

		//check if JWT exists in the cookies
		if (!encodedJwt) {
			response
				.status(403)
				.json({
					status: 'fail',
					message: 'No jwt',
				})
				.send();
			return false;
		}

		try {
			//Verify if the JWT is valid
			const decode = this.jwtService.verify(encodedJwt);

			const user = await this.prisma.user.findFirst({
				where: {
					OR: [
						{
							name: decode.login,
							id: decode.sub,
						},
						{
							banJwt: {
								has: encodedJwt,
							},
						},
					],
				},
			});

			if (!user) {
				response
					.status(403)
					.json({
						status: 'fail',
						message: 'User does not exist',
					})
					.send();
				return false;
			}

			if (user.banJwt.includes(encodedJwt)) {
				response
					.status(403)
					.json({
						status: 'fail',
						message: 'Jwt is banned',
					})
					.send();
				return false;
			}

			request['userLogin'] = decode.login;
			request['userID'] = decode.sub;

			return true;
		} catch (error) {
			response
				.status(403)
				.json({
					status: 'fail',
					message: 'Unvalid jwt',
				})
				.send();
			return false;
		}
	}
}
