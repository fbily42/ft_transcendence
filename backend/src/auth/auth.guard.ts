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
			//que se passe t il si on a passe la date d'expiration ? envoie une erreur ? 
			const decode = this.jwtService.decode(encodedJwt);
			const user = await this.prisma.user.findUnique({
				where:{
					name: decode.login,
					id: decode.sub,
				}
			});
			if (!user)
				return false;
			const user1 = await this.prisma.user.findFirst({
				where:{
					Ban_jwt: {
						has: encodedJwt,
					},
				}
			});
			if (user1)
			{
				//faire un redirect vers le logout, car si une personne fait un appel a un token blacklist c'est qu'il l'a vole ou que la personne est deconnecte
				console.log('jwt banned')
				return false
			}
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
