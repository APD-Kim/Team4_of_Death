import CustomError from '../utils/errorHandler.js';
import { sendMail } from '../utils/auth.js';
import { redisClient } from '../model/redis.js';

export class UserController {
  constructor(userService) {
    this.userService = userService;
  }
  signUp = async (req, res, next) => {
    try {
      const { email, password, passwordCheck, name, phoneNumber, petCategory } = req.body;
      let profileImg = '';

      if (!req.file || req.file.key.length == 0) {
        profileImg = 'imgStorage/defaultUser.png';
      } else {
        profileImg = req.file.key;
      }

      if (!email || !password || !passwordCheck || !name || !phoneNumber || !petCategory) {
        this.userService.deleteImage(profileImg);
        throw new CustomError(400, '요청이 잘못 되었습니다.');
      }
      if (petCategory && !['dog', 'cat', 'bird'].includes(petCategory)) {
        this.userService.deleteImage(profileImg);
        throw new CustomError(400, '적절하지 않은 카테고리입니다.');
      }
      if (password !== passwordCheck) {
        this.userService.deleteImage(profileImg);
        throw new CustomError(400, '비밀번호를 다시 확인하세요.');
      }

      await this.userService.validatePhoneNumber(phoneNumber);
      const signedUser = await this.userService.signUp(email, password, name, phoneNumber, petCategory, profileImg);
      const verificationCode = Math.random().toString(36).substring(7);
      await sendMail(email, verificationCode);
      res.status(201).json({
        message: '회원가입이 완료되었습니다. 이메일로 전송된 인증코드를 입력하고 이메일 인증을 완료하세요.',
        data: signedUser,
      });
    } catch (err) {
      console.log(1, err.message);
      console.log(1, err);
      if (err.message === `Missing credentials for "PLAIN"`) {
        err.message = '이메일 전송 중 오류가 발생하였습니다.';
      }
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

  reSendAuthenticationCode = async (req, res, next) => {
    try {
      const { email } = req.params;
      const verificationCode = Math.random().toString(36).substring(7);
      await sendMail(email, verificationCode);

      res.status(201).json({
        message: '인증코드가 재발급 되었습니다.',
      });
    } catch (err) {
      if (err.message === `Missing credentials for "PLAIN"`) {
        err.message = '이메일 전송 중 오류가 발생하였습니다.';
      }
      next(err);
    }
  };

  // 노드메일러 인증코드 확인
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

  /** 사용자 로그아웃 */
  logOut = async (req, res, next) => {
    try {
      const { userId } = req.user;
      if (!userId) {
        throw new CustomError(400, '사용자 정보가 전달되지 않았습니다');
      }

      // Redis 메모리 내 RefreshToken 삭제
      const tokens = await this.userService.removeToken(userId);

      // 클라이언트 쿠키 정보 삭제
      res.clearCookie('authorization', { path: '/', secure: true });
      res.clearCookie('refreshToken', { path: '/', secure: true });

      return res.status(200).json({ message: '로그아웃 되었습니다.' });
    } catch (err) {
      next(err);
    }
  };

  /** 사용자 정보 조회 */
  findOneUser = async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new CustomError(400, '사용자 정보가 전달되지 않았습니다');
      }
      const user = await this.userService.findOneUser(userId);
      return res.status(200).json({ message: user });
    } catch (err) {
      next(err);
    }
  };

  /** 사용자 정보 수정 */
  updateUser = async (req, res, next) => {
    try {
      const { email, password, passwordCheck, name, phoneNumber, petCategory } = req.body;
      let profileImg = '';

      if (!req.file || req.file.key.length == 0) {
        profileImg = 'imgStorage/defaultUser.png';
      } else {
        profileImg = req.file.key;
      }

      const { userId } = req.params;
      if (!userId) {
        this.userService.deleteImage(profileImg);
        throw new CustomError(400, '사용자 정보가 전달되지 않았습니다');
      }

      if (!email || !password || !passwordCheck || !name || !phoneNumber || !petCategory) {
        this.userService.deleteImage(profileImg);
        throw new CustomError(400, '요청이 잘못 되었습니다.');
      }

      if (password !== passwordCheck) {
        this.userService.deleteImage(profileImg);
        throw new CustomError(400, '비밀번호를 다시 확인하세요.');
      }

      const user = await this.userService.updateUser(
        userId,
        email,
        password,
        name,
        phoneNumber,
        petCategory,
        profileImg
      );
      return res.status(200).json({ message: user });
    } catch (err) {
      next(err);
    }
  };

  /** 사용자 정보 삭제 */
  deleteUser = async (req, res, next) => {
    try {
      const { userId } = req.params;
      if (!userId) {
        throw new CustomError(400, '사용자 정보가 전달되지 않았습니다');
      }

      await this.userService.deleteUser(userId);
      return res.status(200).json({ message: '정상적으로 탈퇴되었습니다.' });
    } catch (err) {
      next(err);
    }
  };

  /** 사용자 이미지 업로드 */
  uploadImage = async (req, res, next) => {
    try {
      const { userId } = req.params;
      const profileImg = req.file.key;
      if (!profileImg) {
        throw new CustomError(400, '이미지 파일이 존재하지 않습니다.');
      }

      if (!userId || profileImg === undefined) {
        throw new CustomError(400, '이미지 정보가 존재하지 않습니다.');
      }

      const uploadImage = await this.userService.uploadImage(userId, profileImg);

      if (!uploadImage) {
        throw new CustomError(400, '이미지 DB저장에 실패하였습니다.');
      }

      res.status(201).json({ message: '이미지 업로드 완료', data: uploadImage });
    } catch (err) {
      next(err);
    }
  };
}
