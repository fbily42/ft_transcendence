import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private jwtService: JwtService) {}


	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		
		//TODO: A l'avenir, les JWT seront toujours transmis dans le header['Authorization'] donc l'extraction du JWT est a modifier.
		// const cookie: string = request.headers['authorization'];
		const cookie: string = request.headers.authorization;
		const encodedJwt: string = cookie.split(' ', 2)[1];
		// console.log(encodedJwt);

		//TODO: Implementer la verification du JWT
		const decode = this.jwtService.decode(encodedJwt);
		// console.log(decode.login);
		// console.log(decode.sub);
		request['userLogin'] = decode.login;
		request['userID'] = decode.sub;
		return true;
	}
}