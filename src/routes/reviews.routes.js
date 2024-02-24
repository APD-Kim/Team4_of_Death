import express from "express";
import prisma from "../utils/prisma.js";
import authJwt from "../middlewares/auth.middleware.js";
import { ReviewController } from "../controllers/reviews.controller.js";
import { ReviewService } from "../services/reviews.service.js";
import { ReviewRepository } from "../repositories/reviews.repository.js";

const router = express.Router();

const reviewRepository = new ReviewRepository(prisma);
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService); 

router("/reviews?trainerId=:trainerId", authJwt, reviewController.postReview)
router("/reviews?trainerId=:trainerId", authJwt, reviewController.getReviews)
router("/reviews/:reviewId", authJwt, reviewController.patchReview)
router("/reviews/:reviewId", authJwt, reviewController.deleteReview)

export default router;