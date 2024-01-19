import { Injectable, CanActivate, ExecutionContext, Redirect } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService,
		private prisma: PrismaService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();
		
		const encodedJwt: string = request.cookies.jwt;
		// const encodedRefereshJwt: string = request.cookies.refresh_jwt;

		//check if JWT exists in the cookies
		if (!encodedJwt)
		{
			// console.log('NO PERMISSION : jwt cookie doesn\'t exist');
			return false;
		}

		try {
			//Verify if the JWT is valid
			this.jwtService.verify(encodedJwt);
			const decode = this.jwtService.decode(encodedJwt);
			const user = await this.prisma.user.findUnique({
				where:{
					name: decode.login,
					id: decode.sub,
				}
			})
			if (!user)
				return false;
			request['userLogin'] = decode.login;
			request['userID'] = decode.sub;
			return true;
		}
		catch (error)
		{
			response.clearCookie('jwt', { path: '/' });
			// console.log('NO PERMISSION : authorization incorrect');
			return false;
		}

	}

	
}
