import { nanoid } from 'nanoid';

export class UserRepository {
  constructor(prisma, redis) {
    this.prisma = prisma;
    this.redis = redis;
  }
  findUserByEmail = async (email) => {
    const findUser = await this.prisma.users.findFirst({
      where: {
        email,
      },
    });
    return findUser;
  };
  findUserByUserId = async (userId) => {
    const findUser = await this.prisma.users.findFirst({
      where: {
        userId: Number(userId),
      },
      include: {
        points: true,
      },
    });
    return findUser;
  };
  signUpWithEmail = async (email, password, name, phoneNumber, petCategory) => {
    const result = await this.prisma.$transaction(async (prisma) => {
      const createdUser = await prisma.users.create({
        data: {
          email,
          password,
          name,
          phoneNumber,
          petCategory,
        },
      });
      const point = await prisma.points.create({
        data: {
          pointId: nanoid(),
          userId: Number(createdUser.userId),
          point: 1000,
        },
      });
      return { createdUser, point };
    });
    return result;
  };
  findUserByPhoneNumber = async (phoneNumber) => {
    const result = await this.prisma.users.findFirst({
      where: {
        phoneNumber,
      },
    });
    return result;
  };
  saveToken = async (refreshToken, userId) => {
    const savedToken = await this.redis.set(`refreshToken:${userId}`, refreshToken, { EX: 3600 * 24 * 7 });
    return savedToken;
  };
}
