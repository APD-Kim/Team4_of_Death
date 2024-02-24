import express from 'express';
import { TrainerController } from '../controllers/trainers.controller.js';
import { TrainerService } from '../services/trainers.service.js';
import { TrainerRepository } from '../repositories/trainers.repository.js';
import { authJwt } from "../middlewares/auth.middleware.js";

import { prisma } from '../utils/prisma.js';
const trainerRepository = new TrainerRepository(prisma);
const trainerService = new TrainerService(trainerRepository);
const trainerController = new TrainerController(trainerService);

const router = express.Router();

router.post('/', trainerController.registerTrainer);
router.get('/', trainerController.findAllTrainer);
router.get('/:trainerId', trainerController.findOneTrainer);
router.post('/:trainerId/likes', authJwt, trainerController.likesTrainer);

export default router;
