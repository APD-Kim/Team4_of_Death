import express from 'express';
import { prisma } from '../utils/prisma.js';
import { ReservationController } from '../controllers/reservations.controller.js';
import { ReservationService } from '../services/reservations.service.js';
import { ReservationRepository } from '../repositories/reservations.repository.js';
import { authJwt } from '../middlewares/auth.middleware.js';
import { TrainerRepository } from '../repositories/trainers.repository.js';
import { PointRepository } from '../repositories/points.repository.js';

const reservationRepository = new ReservationRepository(prisma);
const trainerRepository = new TrainerRepository(prisma);
const pointRepository = new PointRepository(prisma);
const reservationService = new ReservationService(reservationRepository, trainerRepository, pointRepository);
const reservationController = new ReservationController(reservationService);

const router = express.Router();

router.post('/', authJwt, reservationController.reserveTrainer);
router.get('/', authJwt, reservationController.getDates);
router.get('/:trainerId', reservationController.findPossibleDatesForTrainer);
router.put('/:reservationId', authJwt, reservationController.putReservation);
router.delete('/:reservationId', authJwt, reservationController.delReservation);

export default router;
