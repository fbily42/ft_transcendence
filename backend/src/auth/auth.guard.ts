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

		//check if JWT exists in the cookies
		if (!encodedJwt)
		{
			// console.log('NO PERMISSION : jwt cookie doesn\'t exist');
			return false;
		}

		try {
			//Verify if the JWT is valid
			const decode = this.jwtService.verify(encodedJwt);
			const user = await this.prisma.user.findUnique({
				where:{
					name: decode.login,
					id: decode.sub,
				}
			})
			if (!user){
				response.status(403).json({
					status: "fail",
					message: "User does not exist",
				}).send();
				return false;
			}

			//Verify 2FA
			if (decode.otp_enabled && !decode.otp_provided)
			{
				response.status(401).json({
					status: "2FA-fail",
					message: "2FA required",
				}).send();
				return false
			}
			
			request['userLogin'] = decode.login;
			request['userID'] = decode.sub;
			return true;
		}
		catch (error)
		{
			response.status(403).json({
				status: "fail",
				message: "Unvalid token",
			}).send();
			return false;
		}

	}

	
}
