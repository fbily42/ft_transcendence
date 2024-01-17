import { Injectable, CanActivate, ExecutionContext, Redirect } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		
		const encodedJwt: string = request.cookies.jwt;

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
			request['userLogin'] = decode.login;
			request['userID'] = decode.sub;
			return true;
		}
		catch (error)
		{
			// console.log('NO PERMISSION : authorization incorrect');
			return false;
		}

	}

	
}