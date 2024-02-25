import express from "express";
import { ReservationController } from "../controllers/reservations.controller.js";
import { ReservationService } from "../services/reservations.service.js";
import { ReservationRepository } from "../repositories/reservations.repository.js";
import { TrainerService } from '../services/trainers.service.js';
import { authJwt } from "../middlewares/auth.middleware.js";
import { PointRepository } from "../repositories/points.repositories.js";

const reservationRepository = new ReservationRepository(prisma);
const reservationService = new ReservationService(reservationRepository, PointRepository);
const reservationController = new ReservationController(reservationService, TrainerService);

const router = express.Router();

router.post('/reservations', authJwt, reservationController.reserveTrainer)

export default router;