import CustomError from '../utils/errorHandler.js';
import { sendMail } from '../utils/auth.js';
import { redisClient } from '../model/redis.js';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
//aws.config.loadFromPath(__dirname + '/../../.env');
import path from 'path';
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
      const verificationCode = Math.random().toString(36).substring(7);
      await sendMail(email, verificationCode);
      res.status(201).json({
        message: '회원가입이 완료되었습니다. 이메일로 전송된 인증코드를 입력하고 이메일 인증을 완료하세요.',
        data: signedUser,
      });
    } catch (err) {
      if (err.message === `Missing credentials for "PLAIN"`) {
        err.message = '이메일 전송 중 오류가 발생하였습니다.';
      }
      next(err);
    } finally {
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

  /** 사용자 이미지 업로드 */
  uploadImage = async (req, res, next) => {
    try {
      const postImage = req.file;
      const postBody = req.body;

      if (!postImage) {
        throw new CustomError(400, '이미지 파일이 존재하지 않습니다.');
      }

      //const imageName = postImage.originalname;
      const userId = postBody.userId;
      const imageURL = postImage.location;

      if (!userId || imageURL === undefined) {
        throw new CustomError(400, '이미지 정보가 존재하지 않습니다.');
      }

      const uploadImage = await this.userService.uploadImage(userId, imageURL);

      if (!uploadImage) {
        throw new CustomError(400, '이미지 DB저장에 실패하였습니다.');
      }

      res.status(201).json({ message: '이미지 업로드 완료', data: postImage });
    } catch (err) {
      next(err);
    }
  };

  /** 사용자 이미지-게시글 업로드 */

  /** 사용자 이미지 조회 */
  showImage = async (req, res, next) => {
    try {
      res.render(upload);
      //res.sendFile(path.join(__dirname, 'multipart.html')); // get요청 시, html띄우기
    } catch (err) {
      next(err);
    }
  };

  /** 사용자 이미지 수정 */
  updateImage = async (req, res, next) => {
    try {
      //res.render('upload');
      res.sendFile(path.join(__dirname, 'multipart.html'));
    } catch (err) {
      next(err);
    }
  };

  /** 사용자 이미지 삭제 */
  deleteImage = async (req, res, next) => {
    try {
      s3.deleteObject({
        bucket: 'mybucket-s3-test99',
        key: req.file.originalname,
      });
      res.sendFile(path.join(__dirname, 'multipart.html'));
    } catch (err) {
      next(err);
    }
  };
}
