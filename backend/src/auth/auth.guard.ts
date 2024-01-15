import { Injectable, CanActivate, ExecutionContext, Redirect } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();
		
		//TODO: A l'avenir, les JWT seront toujours transmis dans le header['Authorization'] donc l'extraction du JWT est a modifier.
		// const cookie: string = request.headers['authorization'];
		const cookie: string = request.headers.authorization;

		//check if authorization exist, if it doesn't we redirect to  the authentification step
		if (!cookie)
		{
			// console.log(cookie);
			console.log('NO PERMISSION : authorization doesn\'t exist');
			response.redirect('http://localhost:3000/auth/');
			return false;
		}

		try {
			//Get the JWT, then Verify if it's correct
			const encodedJwt: string = cookie.split(' ', 2)[1];
			// console.log(encodedJwt);
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
			response.redirect('http://localhost:3000/auth/');
			return false;
		}

		return true;
	}

	
}