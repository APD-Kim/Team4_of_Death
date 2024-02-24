import CustomError from "../utils/errorHandler.js";
import bcrypt from "bcrypt"

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  findUserByEmail = async (email, needError) => {
    const user = await this.userRepository.findUserByEmail(email);
    //회원가입할땐 해당 이메일로 생성된 유저가 없어야함
    if (!user && needError === true) throw new CustomError(404, "해당 유저를 찾을 수 없습니다.")

    return user ? user : null
  }
  signUp = async (email, password, name, phoneNumber, petCategory) => {
    const findUser = await this.userRepository.findUserByPhoneNumber(phoneNumber)
    if (findUser) {
      throw new CustomError(400, "이미 가입된 전화번호입니다.")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const createdUser = await this.userRepository.signUpWithEmail(email, hashedPassword, name, phoneNumber, petCategory)
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
    console.log(user);
    //회원가입할땐 해당 이메일로 생성된 유저가 없어야함
    if (!user) throw new CustomError(404, "이메일을 다시 한번 확인해주세요.")
    const comparePassword = await bcrypt.compare(password, user.password)
    if (!comparePassword) {
      throw new CustomError(400, "비밀번호를 다시 한번 확인해주세요.")
    }
    return user;
  }
}