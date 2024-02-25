import express from "express";
import { PointController } from "../controllers/points.controller.js";
import { PointService } from "../services/points.service.js";
import { PointRepository } from "../repositories/points.repository.js";
import { authJwt } from "../middlewares/auth.middleware.js";

const pointsRepository = new PointRepository(prisma);
const pointsService = new PointService(pointsRepository);
const pointsController = new PointController(pointsService);

const router = express.Router();

router.post('/reservations', authJwt, pointsController.addPoint)

export default router;