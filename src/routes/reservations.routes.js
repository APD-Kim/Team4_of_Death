import express from "express";
import { ReservationController } from "../controllers/reservations.controller.js";
import { ReservationService } from "../services/reservations.service.js";
import { ReservationRepository } from "../repositories/reservations.repository.js";

const router = express.Router();

export default router;