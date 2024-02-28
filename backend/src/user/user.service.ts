import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeaderboardDTO } from './dto/leaderboard.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
	) {}

	async getInfo(name: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				name: name,
			},
		});
		if (!user) return null;
		delete user.jwt;
		return user;
	}

	async getUsers() {
		const user = await this.prisma.user.findMany({
			// select: {
			// 	name: true,
			// 	pseudo: true,
			// 	score: true,
			// 	avatar: true,
			// 	rank: true,
			// },
		});
		if (!user) return null;
		return user;
	}
	
	async getUserById(id: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: id,
			},
			select: {
				id: true,
				name: true,
				pseudo: true,
				score: true,
				avatar: true,
				rank: true,
				wins: true,
				games: true,
				photo42: true,
				friends: true,
			},
		});
		if (!user) return null;
		return user;
	}

	async getOtherInfo(pseudo, currentUser) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					pseudo: pseudo,
				},
				select: {
					name: true,
					pseudo: true,
					score: true,
					avatar: true,
					rank: true,
				},
			});

			if (!user && user.name == currentUser)
				throw new HttpException(
					'This user does not exist',
					HttpStatus.BAD_REQUEST,
				);

			// delete user.token42;
			// delete user.jwt;
			return user;
		} catch (error) {
			if (error instanceof HttpException) {
				throw error;
			} else if (error instanceof PrismaClientKnownRequestError) {
				throw new HttpException(
					`Prisma error: ${error.code}`,
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			}
			throw new HttpException(
				'Internal server error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async getLeaderboard() {
		const leaderboardData = await this.prisma.user.findMany({
			orderBy: {
				score: 'desc',
			},
			select: {
				photo42: true,
				name: true, // ajouter le pseudo plus tard
				rank: true,
				score: true,
			},
		});

		return leaderboardData;
	}

	async updateRanks(dto: LeaderboardDTO[]) {
		try {
			for (const user of dto) {
				await this.prisma.user.update({
					where: { name: user.name },
					data: { rank: user.rank },
				});
			}
		} catch (error) {
			throw new HttpException(
				'Internal Server Error',
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}
	}
}
