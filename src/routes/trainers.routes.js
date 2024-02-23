import express from "express";
import { TrainerController } from "../controllers/trainers.controller.js";
import { TrainerService } from "../services/trainers.service.js";
import { TrainerRepository } from "../repositories/trainers.repository.js";

const router = express.Router();

export default router;