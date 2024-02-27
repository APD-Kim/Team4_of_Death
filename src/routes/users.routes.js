import express from 'express';
import { UserController } from '../controllers/users.controller.js';
import { UserService } from '../services/users.service.js';
import { UserRepository } from '../repositories/users.repository.js';
import { prisma } from '../utils/prisma.js';
import { authJwt } from '../middlewares/auth.middleware.js';
import { redisCli } from '../model/redis.js';
import multer from 'multer';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
//aws.config.loadFromPath(__dirname + '/../../.env');
import path from 'path';
import 'dotenv/config';
import { upload } from '../model/multer.js';

const router = express.Router();

const userRepository = new UserRepository(prisma, redisCli);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/sign-up', upload.single('profileImage'), userController.signUp);
router.post('/login', userController.logIn);
router.post('/refresh', authJwt, userController.issueRefreshToken);

//3. 싱글이미지 파일 업로드(라우터)
router.post('/upload-image', upload.single('profileImage'), userController.uploadImage);

/** 사용자 이미지-게시글 업로드 */
const upload2 = multer(); // upload2.none() 용도 : multipart/form-data > textarea 형식 처리

router.post('/', upload2.none(), async (req, res, next) => {});

/** 사용자 이미지 조회 */
router.get('/show-image', userController.showImage);

/** 사용자 이미지 수정 */
router.patch('/show-image', userController.updateImage);

/** 사용자 이미지 삭제 */
router.delete('/show-image', userController.deleteImage);

export default router;
