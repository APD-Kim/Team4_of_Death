import express from 'express';
import { prisma } from '../utils/prisma.js';
import { ReservationController } from '../controllers/reservations.controller.js';
import { ReservationService } from '../services/reservations.service.js';
import { ReservationRepository } from '../repositories/reservations.repository.js';

const router = express.Router();

const reservatinonRepository = new ReservationRepository(prisma);
const reservationService = new ReservationService(reservatinonRepository);
const reservationController = new ReservationController(reservationService);

router.get('/', reservationController.getDates);
router.put('/:reservationId', reservationController.putReservation);
router.delete('/:reservationId', reservationController.delReservation);

export default router;
