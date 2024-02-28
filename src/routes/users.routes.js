import express from 'express';
import { UserController } from '../controllers/users.controller.js';
import { UserService } from '../services/users.service.js';
import { UserRepository } from '../repositories/users.repository.js';
import { prisma } from '../utils/prisma.js';
import { authJwt } from '../middlewares/auth.middleware.js';
import { redisCli } from '../model/redis.js';
import { upload } from '../model/multer.js';

const router = express.Router();

const userRepository = new UserRepository(prisma, redisCli);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/sign-up', upload.single('profileImg'), userController.signUp);
router.post('/login', userController.logIn);
router.post('/refresh', authJwt, userController.issueRefreshToken);

/** 사용자 로그아웃 */
router.post('/logout', authJwt, userController.logOut);

/** 사용자 정보 조회 */
router.get('/:userId', userController.findOneUser);

/** 사용자 정보 삭제 */
router.delete('/:userId', authJwt, userController.deleteUser);

/** 사용자 정보 수정 */
router.put('/:userId', authJwt, upload.single('profileImg'), userController.updateUser);
router.put('/upload-image/:userId', upload.single('profileImg'), userController.uploadImage);

export default router;
