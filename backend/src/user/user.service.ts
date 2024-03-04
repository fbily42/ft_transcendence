import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LeaderboardDTO } from './dto/leaderboard.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserData } from './types/user.types';
import { AchievementType } from '@prisma/client';
import { EMPTY } from 'rxjs';

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
	) {}

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
				}
			});
			if (!user) {
				throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
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
		const user = await this.prisma.user.findMany({
			
		});
		if (!user) return null;
		return user;
	}
	
	async getUserById(id: string) {
		try {

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
				throw new HttpException('User does not exists', HttpStatus.BAD_REQUEST);
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
				name: true,
				rank: true,
				score: true,
				pseudo: true,
				avatar: true,
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

	async GameHistory(userId: string) {
		const allUserGames = await this.prisma.game.findMany({
			where: {
				OR:[
					{
						user:{
							id:userId
						}
					},{
						opponent:{
							id:userId
						}
					}
				],
			},
			orderBy: {
				createdAt:"desc",
			},
			include: {
				user: {
					select: {
						pseudo: true,
						avatar: true,
					}
				},
				opponent: {
					select: {
						pseudo: true,
						avatar: true,
					}
				}
			},
		});
		return allUserGames
	}

	async updateChosenBadge(userId: string, chosenBadge: AchievementType) {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id: userId,
				},
			})
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
			}
			else {
				const updatedUser = await this.prisma.user.update({
					where: {
						id: userId,
					},
					data: {
						chosenBadge: chosenBadge,
					},
				})
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
			})
			if (!user) {
				throw new HttpException(
					'This user does not exist',
					HttpStatus.BAD_REQUEST,
				);
			}
			const userBadges = user.allBadges;
			if (!userBadges.includes(chosenBadge)) {
				userBadges.push(chosenBadge);
			}
			else {
				return ;
			}
			const updatedUser = await this.prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					allBadges: userBadges,
					chosenBadge: chosenBadge,
				},
			})
			
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

