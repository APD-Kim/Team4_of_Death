export class UserRepository {
  constructor(prisma, redis) {
    this.prisma = prisma;
    this.redis = redis
  }
  findUserByEmail = async (email) => {
    const findUser = await this.prisma.users.findFirst({
      where: {
        email,
      }
    })
    return findUser;
  }
  signUpWithEmail = async (email, password, name, phoneNumber, petCategory) => {
    const result = await this.prisma.users.create({
      data: {
        email,
        password,
        name,
        phoneNumber,
        petCategory
      }
    })
    return result;
  }
  findUserByPhoneNumber = async (phoneNumber) => {
    const result = await this.prisma.users.findFirst({
      where: {
        phoneNumber,
      }
    })
    return result
  }
  saveToken = async (refreshToken, userId) => {
    const savedToken = await this.redis.set(`refreshToken:${userId}`, refreshToken, { EX: 3600 * 24 * 7 })
    return savedToken
  }
}