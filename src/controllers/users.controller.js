import CustomError from '../utils/errorHandler.js';
import { sendMail } from '../utils/auth.js';
import { redisClient } from '../model/redis.js';
import 'dotenv/config';

export class UserController {
  constructor(userService) {
    this.userService = userService;
  }
  signUp = async (req, res, next) => {
    try {
      const { email, password, passwordCheck, name, phoneNumber, petCategory } = req.body;
      let profileImg = '';

      if (!email || !password || !passwordCheck || !name || !phoneNumber || !petCategory) {
        throw new CustomError(400, '요청이 잘못 되었습니다.');
      }
      if (petCategory && !['dog', 'cat', 'bird'].includes(petCategory)) {
        throw new CustomError(400, '적절하지 않은 카테고리입니다.');
      }
      if (password !== passwordCheck) {
        throw new CustomError(400, '비밀번호를 다시 확인하세요.');
      }

      if (!req.file || req.file.location.length == 0) {
        profileImg = 'https://mybucket-s3-test99.s3.ap-northeast-2.amazonaws.com/imgStorage/defaultUser.png';
      } else {
        profileImg = req.file.location;
      }

      await this.userService.validatePhoneNumber(phoneNumber);
      const signedUser = await this.userService.signUp(email, password, name, phoneNumber, petCategory, profileImg);

      res.status(201).json({ message: '회원가입 완료', data: signedUser });
    } catch (err) {
      next(err);
    }
  };

  logIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new CustomError(400, '요청이 잘못 되었습니다.');
      }
      const user = await this.userService.validUser(email, password);
      const { userId } = user;
      //이메일과 비밀번호가 일치하는지 확인함
      const tokens = await this.userService.signToken(userId);
      res.cookie('authorization', tokens.bearerToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 1000 * 60 * 60),
      });
      res.cookie('refreshToken', tokens.bearerRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });
      res.status(200).json({ accessToken: tokens.bearerToken, refreshToken: tokens.bearerRefreshToken });
    } catch (err) {
      next(err);
    }
  };
  issueRefreshToken = async (req, res, next) => {
    const { userId } = req.user;
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new CustomError(400, '리프레시 토큰이 존재하지 않습니다.');
    }
    //리프레시 토큰이 있다면

    res.status(200).json({ message: refreshToken });
  };
  
  sendEmailVerification = async (req, res, next) => {
    try {
      const { email } = req.params;
      if (!email) {
        throw new CustomError(400, '이메일 주소를 입력하세요.');
      }

      const verificationCode = Math.random().toString(36).substring(7);
      await sendMail(email, verificationCode);

      res.status(200).json({ message: '이메일로 인증 코드가 전송되었습니다.' });
    } catch (err) {
      next(err);
    }
  };

  verifyEmail = async (req, res, next) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        throw new CustomError(400, '이메일과 코드를 모두 제공해주세요.');
      }
      const cashedCode = await new Promise((resolve, reject) => {
        redisClient.get(email, (err, cashedCode) => {
          if (err) {
            reject(new CustomError(500, 'Redis에서 인증 코드 가져오는 중 오류가 발생했습니다.'));
          }
          resolve(cashedCode);
        });
      });
      if (!cashedCode || code !== cashedCode) {
        throw new CustomError(400, '인증 코드가 일치하지 않습니다.');
      }
      await this.userService.verifyEmail(email, code); // 이메일과 코드를 함께 전달
      res.status(200).json({ message: '인증이 성공적으로 완료되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
}
