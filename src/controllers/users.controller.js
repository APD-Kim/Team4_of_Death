import CustomError from "../utils/errorHandler.js";
import pkg from "jsonwebtoken";
const { sign, verfiy } = pkg;
export class UserController {

  constructor(userService) {
    this.userService = userService;
  }
  signUp = async (req, res, next) => {
    try {
      const { email, password, passwordCheck, name, phoneNumber, petCategory } = req.body;
      if (!email || !password || !passwordCheck || !name || !phoneNumber || !petCategory) {
        throw new CustomError(400, "요청이 잘못 되었습니다.")
      }
      if (petCategory && !["dog", "cat", "bird"].includes(petCategory)) {
        throw new CustomError(400, "적절하지 않은 카테고리입니다.")
      }
      await this.userService.validatePhoneNumber(phoneNumber)
      if (password !== passwordCheck) {
        throw new CustomError(400, "비밀번호를 다시 확인하세요.")
      }
      const findUser = await this.userService.findUserByEmail(email)
      if (findUser) {
        throw new CustomError(400, "이미 해당 이메일이 존재합니다.")
      }
      const singedUser = await this.userService.signUp(email, password, name, phoneNumber, petCategory)

      res.status(201).json({ message: "회원가입 완료", data: singedUser })
    } catch (err) {
      next(err)
    }
  }
  logIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new CustomError(400, "요청이 잘못 되었습니다.")
      }
      const user = await this.userService.validUser(email, password)
      //이메일과 비밀번호가 일치하는지 확인함
      const token = sign(
        { userId: user.userId },
        process.env.SECRET_KEY,
        { expiresIn: '1h' })
      res.cookie('authorization', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 1000 * 60 * 60)
      })
      res.status(200).json({ accessToken: token })
    } catch (err) {
      next(err)
    }
  }
}