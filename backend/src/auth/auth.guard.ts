import { Injectable, CanActivate, ExecutionContext, Redirect } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		
		const encodedJwt: string = request.cookies.jwt;

		//check if authorization exist, if it doesn't we redirect to  the authentification step
		if (!encodedJwt)
		{
			console.log('NO PERMISSION : jwt cookie doesn\'t exist');
			return false;
		}

		try {
			//Get the JWT, then Verify if it's correct
			this.jwtService.verify(encodedJwt);
			const decode = this.jwtService.decode(encodedJwt);
			request['userLogin'] = decode.login;
			request['userID'] = decode.sub;
			// console.log('tout est bon')
			// console.log(decode);
			return true;
		}
		catch (error)
		{
			// console.error('Erreur de vérification du JWT :', error);
			console.log('NO PERMISSION : authorization incorrect');
			return false;
		}

	}

	
}