import CustomError from '../utils/errorHandler.js';

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

      console.log(uploadImage);
      if (!uploadImage) {
        throw new CustomError(400, '이미지 DB저장에 실패하였습니다.');
      }

      res.status(201).json({ message: '이미지 업로드 완료', data: uploadImage });
    } catch (err) {
      next(err);
    }
  };
}
