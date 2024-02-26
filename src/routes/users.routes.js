import express from 'express';
import { UserController } from '../controllers/users.controller.js';
import { UserService } from '../services/users.service.js';
import { UserRepository } from '../repositories/users.repository.js';
import { prisma } from '../utils/prisma.js';
import { authJwt } from '../middlewares/auth.middleware.js';
import { redisCli } from '../model/redis.js';

const router = express.Router();

const userRepository = new UserRepository(prisma, redisCli);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/sign-up', userController.signUp);
router.post('/login', userController.logIn);
router.post('/refresh', authJwt, userController.issueRefreshToken);

export default router;
