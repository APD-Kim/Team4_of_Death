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

  /** 사용자 이미지 업로드 */
  uploadImage = async (req, res, next) => {
    try {
      const postImage = req.file;
      const postBody = req.body;

      console.log(postImage);
      console.log(postBody);

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

      console.log(uploadImage);
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
