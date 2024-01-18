import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
	) {}

	async getInfo(jwt: any) {
		const jwtPayload = this.jwtService.decode(jwt);

		const user = await this.prisma.user.findUnique({
			where: {
				name: jwtPayload.login,
			},
		});
		if (!user) return null;
		delete user.token42;
		delete user.jwt;
		return user;
	}

	async getLeaderboard() {
		const leaderboardData = await this.prisma.user.findMany({
			orderBy: {
				score: 'desc',
			},
			select: {
				name: true, // ajouter le pseudo plus tard
				rank: true,
				score: true,
			},
		});
		console.log('Leaderboard Data:', leaderboardData);

		return leaderboardData;
	}

	async updateRanks(data: any) {
		try {
			for (const user of data) {
				await this.prisma.user.update({
					where: { name: user.name },
					data: { rank: user.rank },
				});
			}
		}
		catch (error) { // TODO: catch error
			console.error(error);
		}
	}
}
