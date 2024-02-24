import CustomError from "../utils/errorHandler.js";
import { signToken } from "../utils/auth.js";
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
        throw new CustomError(400, "요청이 잘못 되었습니다.");
      }
      const user = await this.userService.validUser(email, password);
      const { userId } = user;
      //이메일과 비밀번호가 일치하는지 확인함
      const tokens = await signToken(res, userId);
      res.status(200).json({ accessToken: tokens.token, refreshToken: tokens.refreshToken });
    } catch (err) {
      next(err);
    }
  }
  issueRefreshToken = async (req, res, next) => {
    const { userId } = req.user;
    res.status(200).json({ message: "good" })
  }
}