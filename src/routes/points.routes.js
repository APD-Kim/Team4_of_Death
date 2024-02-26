import express from 'express';
import { PointController } from '../controllers/points.controller.js';
import { PointService } from '../services/points.service.js';
import { PointRepository } from '../repositories/points.repository.js';
import { authJwt } from '../middlewares/auth.middleware.js';
import { prisma } from '../utils/prisma.js';
import { UserRepository } from '../repositories/users.repository.js';
const userRepository = new UserRepository(prisma);
const pointsRepository = new PointRepository(prisma);
const pointsService = new PointService(pointsRepository, userRepository);
const pointsController = new PointController(pointsService);

const router = express.Router();

router.post('/caculate', authJwt, pointsController.cacluatePoint);
router.get('/', authJwt, pointsController.showUserPoint);
router.get('/history', authJwt, pointsController.showPointHistory);

export default router;
