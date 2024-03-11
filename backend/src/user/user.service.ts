import {
	HttpException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeaderboardDTO } from './dto/leaderboard.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AchievementType } from '@prisma/client';

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getInfo(name: string) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					name: name,
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
					looses: true,
					chosenBadge: true,
					allBadges: true,
					blocked: true,
				},
			});
			if (!user) {
				throw new HttpException(
					'User does not exists',
					HttpStatus.BAD_REQUEST,
				);
			}
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

	async getUsers() {
		try {
			const user = await this.prisma.user.findMany({
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
					looses: true,
					chosenBadge: true,
					allBadges: true,
					blocked: true,
				},
			});
			if (!user) {
				throw new HttpException(
					'User does not exists',
					HttpStatus.BAD_REQUEST,
				);
			}
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

	async getUserById(id: string, userId: string) {
		try {
			if (id === userId) {
				throw new HttpException('Bad Request', HttpStatus.BAD_REQUEST);
			}
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
					looses: true,
					chosenBadge: true,
					allBadges: true,
					blocked: true,
				},
			});
			if (!user) {
				throw new HttpException(
					'User does not exists',
					HttpStatus.BAD_REQUEST,
				);
			}
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
		try {
			const leaderboardData = await this.prisma.user.findMany({
				where: {
					NOT: {
						pseudo: null
					}
				},
				orderBy: {
					rank: 'asc',
				},
				select: {
					photo42: true,
					name: true,
					rank: true,
					score: true,
					pseudo: true,
					avatar: true,
				},
			});
			if (!leaderboardData)
				throw new HttpException(
					'Internal server error',
					HttpStatus.INTERNAL_SERVER_ERROR,
				);
			return leaderboardData;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
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

	async GameHistory(userId: string) {
		try {
			const allUserGames = await this.prisma.game.findMany({
				where: {
					OR: [
						{
							user: {
								id: userId,
							},
						},
						{
							opponent: {
								id: userId,
							},
						},
					],
				},
				orderBy: {
					createdAt: 'desc',
				},
				include: {
					user: {
						select: {
							pseudo: true,
							avatar: true,
						},
					},
					opponent: {
						select: {
							pseudo: true,
							avatar: true,
						},
					},
				},
			});
			if (!allUserGames) {
				throw new InternalServerErrorException();
			}
			return allUserGames;
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
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

	async updateChosenBadge(userId: string, chosenBadge: AchievementType) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id: userId,
				},
			});
			if (!user) {
				throw new HttpException(
					'This user does not exist',
					HttpStatus.BAD_REQUEST,
				);
			}
			const userBadges = user.allBadges;
			if (!userBadges.includes(chosenBadge)) {
				throw new HttpException(
					'This user does not have this badge',
					HttpStatus.BAD_REQUEST,
				);
			} else {
				const updatedUser = await this.prisma.user.update({
					where: {
						id: userId,
					},
					data: {
						chosenBadge: chosenBadge,
					},
				});
			}
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

	async addBadge(userId: string, chosenBadge: AchievementType) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id: userId,
				},
			});
			if (!user) {
				throw new HttpException(
					'This user does not exist',
					HttpStatus.BAD_REQUEST,
				);
			}
			const userBadges = user.allBadges;
			if (!userBadges.includes(chosenBadge)) {
				userBadges.push(chosenBadge);
			} else {
				return;
			}
			const updatedUser = await this.prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					allBadges: userBadges,
					chosenBadge: chosenBadge,
				},
			});
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
}
