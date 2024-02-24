export class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
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
}