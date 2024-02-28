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
        email: email,
      },
      data: {
        isVerified: true,
      },
    });
    return updatedUser;
  };
  
  /** 사용자 이미지 업로드 */
  uploadImage = async (userId, imageURL) => {
    console.log('userId', userId);
    console.log('imageURL', imageURL);
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

  /** 사용자 이미지 조회 */
  showImage = async () => {};

  /** 사용자 이미지 수정 */
  updateImage = async () => {};

  /** 사용자 이미지 삭제 */
  deleteImage = async () => {};
}
