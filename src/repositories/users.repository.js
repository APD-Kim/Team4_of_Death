import { nanoid } from 'nanoid';
import { prisma } from '../utils/prisma.js';

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
  signUpWithEmail = async (email, password, name, phoneNumber, petCategory, profileImg) => {
    const result = await this.prisma.$transaction(async (prisma) => {
      const createdUser = await prisma.users.create({
        data: {
          email,
          password,
          name,
          phoneNumber,
          petCategory,
          profileImg,
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

  verifyEmailUpdate = async (email) => {
    const updatedUser = await this.prisma.users.update({
      where: {
        email,
      },
      data: {
        isVerified: true,
      },
    });
    return updatedUser;
  };

  /** 사용자 로그아웃 */
  removeToken = async (userId) => {
    const removeToken = await this.redis.del(`refreshToken:${userId}`);
    return removeToken;
  };

  /** 사용자 정보 조회*/
  findOneUser = async (userId) => {
    const user = await this.prisma.users.findFirst({
      where: {
        userId: +userId,
      },
    });
    const point = await this.prisma.points.findFirst({
      where: {
        userId: +userId,
      },
    });
    const result = { user, point };
    return result;
  };

  /** 사용자 정보 수정 */
  updateUser = async (userId, email, password, name, phoneNumber, petCategory, profileImg) => {
    const user = await this.prisma.users.update({
      where: {
        userId: +userId,
      },
      data: {
        email,
        password,
        name,
        phoneNumber,
        petCategory,
        profileImg,
      },
    });
    return user;
  };

  /** 사용자 정보 삭제 */
  deleteUser = async (userId) => {
    const user = await this.prisma.users.delete({
      where: {
        userId: +userId,
      },
    });

    return user;
  };

  /** 사용자 이미지 업로드 */
  uploadImage = async (userId, imageURL) => {
    const result = await this.prisma.$transaction(async (prisma) => {
      const uploadImage = await prisma.users.update({
        where: {
          userId: +userId,
        },
        data: {
          profileImg: imageURL,
        },
      });
      return { uploadImage };
    });
    return result;
  };
}
