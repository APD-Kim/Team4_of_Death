import express from "express";
import { ReviewController } from "../controllers/reviews.controller.js";
import { ReviewService } from "../services/reviews.service.js";
import { ReviewRepository } from "../repositories/reviews.repository.js";

const router = express.Router();

export default router;