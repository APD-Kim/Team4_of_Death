import express from 'express';
import { prisma } from '../utils/prisma.js';
import { authJwt } from '../middlewares/auth.middleware.js';
import { ReviewController } from '../controllers/reviews.controller.js';
import { ReviewService } from '../services/reviews.service.js';
import { ReviewRepository } from '../repositories/reviews.repository.js';

const router = express.Router();

const reviewRepository = new ReviewRepository(prisma);
const reviewService = new ReviewService(reviewRepository);
const reviewController = new ReviewController(reviewService);

router.post('/', authJwt, reviewController.postReview);
router.get('/', reviewController.getReviews);
router.patch('/:reviewId', authJwt, reviewController.patchReview);
router.delete('/:reviewId', authJwt, reviewController.deleteReview);

export default router;
