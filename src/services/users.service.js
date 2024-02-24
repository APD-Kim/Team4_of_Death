import CustomError from "../utils/errorHandler.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { redisCli } from "../model/redis.js"

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  signUp = async (email, password, name, phoneNumber, petCategory) => {
    const user = await this.userRepository.findUserByEmail(email);
    if (user) {
      throw new CustomError(409, "이미 가입된 이메일입니다.")
    }
    const findUser = await this.userRepository.findUserByPhoneNumber(phoneNumber)
    if (findUser) {
      throw new CustomError(409, "이미 가입된 전화번호입니다.")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const createdUser = await this.userRepository.signUpWithEmail(email, hashedPassword, name, phoneNumber, petCategory);
    return {
      userId: createdUser.userId,
      name: createdUser.name,
      email: createdUser.email,
      phoneNumber: createdUser.phoneNumber,
      role: createdUser.role,
      isTrainer: createdUser.isTrainer,
      petCategory: createdUser.petCategory
    }
  }
  validatePhoneNumber = async (phoneNumber) => {
    const regex = /^010-\d{4}-\d{4}$/
    const validate = regex.test(phoneNumber)
    if (!validate) {
      throw new CustomError(400, "전화번호는 010-xxxx-xxxx로 구성되어야 합니다.")
    }
    return validate;
  }
  validUser = async (email, password) => {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) throw new CustomError(404, "이메일을 다시 한번 확인해주세요.")
    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) {
      throw new CustomError(400, "비밀번호를 다시 한번 확인해주세요.")
    }
    return user;
  }


  signToken = async (userId) => {
    const token = jwt.sign(
      { userId: userId },
      process.env.SECRET_KEY,
      { expiresIn: '1h' })
    const refreshToken = jwt.sign(
      { userId: userId },
      process.env.SECRET_KEY,
      { expiresIn: '7d' })
    const bearerToken = `Bearer ${token}`
    const bearerRefreshToken = `Bearer ${refreshToken}`
    await redisCli.set(`refreshToken:${userId}`, refreshToken, { EX: 3600 * 24 * 7 })

    return {
      bearerToken,
      bearerRefreshToken
    }

  }
}

