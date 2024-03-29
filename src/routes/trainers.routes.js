import express from 'express';
import { TrainerController } from '../controllers/trainers.controller.js';
import { TrainerService } from '../services/trainers.service.js';
import { TrainerRepository } from '../repositories/trainers.repository.js';
import { authJwt } from '../middlewares/auth.middleware.js';

import { prisma } from '../utils/prisma.js';
const trainerRepository = new TrainerRepository(prisma);
const trainerService = new TrainerService(trainerRepository);
const trainerController = new TrainerController(trainerService);

const router = express.Router();

router.post('/', authJwt, trainerController.registerTrainer);
router.get('/', trainerController.findAllTrainer);
router.get('/available-for-reservation', trainerController.findTrainersNoDate); //일자 별로 예약가능한 트레이너 조회
router.get('/:trainerId', trainerController.findOneTrainer);
router.post('/:trainerId/likes', authJwt, trainerController.likesTrainer);

/**카테고리별 펫시터 조회 */
router.get('/category/:category', trainerController.findTrainerByCategory);

router.put('/:trainerId', trainerController.updateTrainer);
router.delete('/:trainerId', trainerController.deleteTrainer);
export default router;
