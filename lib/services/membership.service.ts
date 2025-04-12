import {
  getStartOfWeek,
  getEndOfWeek,
  getEndOfMonth,
  getStartOfMonth,
} from '../helpers/date.helpers';
import { pointMapper } from '../helpers/enum.helpers';
import { getMembershipName } from '../helpers/membership-service.helpers';
import { TierName, PointTransactionType } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

export class MembershipService {
  private prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async testEndPoint() {
    console.log(
      'testing membership service',
      getStartOfWeek(),
      pointMapper['Platinum'],
      getMembershipName(10000),
      TierName.Platinum,
    );
  }

  async getMembership(tiername: TierName, withUsers?: boolean) {
    const membership = await this.prisma.membershipTier.findUnique({
      where: {
        name: tiername,
      },
      include: {
        users: withUsers ? true : false,
        _count: {
          select: {
            users: true,
          }
        }
      }
    });

    return membership;
  }

  async getLeaderboard(period: 'monthly' | 'weekly' = 'weekly') {
    const users = await this.prisma.user.findMany({
      include: {
        pointTransactions: {
          where: {
            createdAt: {
              gte: period === 'weekly' ? getStartOfWeek() : getStartOfMonth(),
              lte: period === 'weekly' ? getEndOfWeek() : getEndOfMonth(),
            },
            type: PointTransactionType.Earn,
          }
        }
      }
    });

    const leaderboard = users.sort((a, b) => {
      const aPoints = a.pointTransactions.reduce((acc, curr) => acc + curr.points, 0);
      const bPoints = b.pointTransactions.reduce((acc, curr) => acc + curr.points, 0);
      return bPoints - aPoints;
    }).slice(0, 3).map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      points: user.pointTransactions.reduce((acc, curr) => acc + curr.points, 0),
    }));

    return leaderboard;
  }

  async createTransaction(userId: string, txRef: string, amount: number) {
    try {
      const transaction = await this.prisma.transaction.create({
        data: {
          userId,
          txRef,
          amount,
        }
      });

      await this.createPointTransaction(userId, transaction.id);

      return {
        message: 'Transaction created successfully',
        transaction,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createPointTransaction(userId: string, transactionId: string) {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: {
          id: transactionId,
        },
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          tier: true,
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const amount = transaction.amount.toNumber();
      const userTierPoints = user.tier ? (1 + pointMapper[user.tier.name]) : 1;

      const pointsToBeAdded = (amount / 10) * userTierPoints;

      await this.prisma.pointTransaction.create({
        data: {
          userId,
          points: pointsToBeAdded,
          transactionId,
          type: PointTransactionType.Earn,
        }
      });

      await this.updateUserTier(userId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateUserTier(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          pointTransactions: {
            where: {
              type: PointTransactionType.Earn,
            },
          },
        },
      });

      const userPoints = user?.pointTransactions.reduce((acc, curr) => acc + curr.points, 0) || 0;

      const membershipTier = getMembershipName(userPoints);

      if (!membershipTier) {
        return;
      }

      const tier = await this.prisma.membershipTier.findUnique({
        where: {
          name: membershipTier,
        },
        select: {
          id: true,
        },
      });

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          tierId: tier?.id,
        }
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUserPoints(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          name: true,
          email: true,
          tier: {
            select: {
              name: true,
            },
          },
          pointTransactions: {
            orderBy: {
              createdAt: 'desc',
            },
            select: {
              points: true,
              type: true,
            },
          },
        },
      });

      const pointTransactions = user?.pointTransactions || [];
      const earnedPointTransactions = user?.pointTransactions.filter(
        (tx) => tx.type === PointTransactionType.Earn
      ) || [];
      const redeemedPointTransactions = user?.pointTransactions.filter(
        (tx) => tx.type === PointTransactionType.Redeem
      ) || [];

      return {
        name: user?.name,
        email: user?.email,
        tier: user?.tier?.name,
        pointTransactions,
        earnedPointTransactions,
        redeemedPointTransactions,
        currentPoints: pointTransactions.reduce((acc, curr) => acc + curr.points, 0) -
          redeemedPointTransactions.reduce((acc, curr) => acc + curr.points, 0),
      };
    } catch (error) {
      console.error(error);
    }
  }
}
