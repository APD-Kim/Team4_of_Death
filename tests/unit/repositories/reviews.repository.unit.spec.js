import { beforeEach, describe, expect, jest } from '@jest/globals';
import { ReviewRepository } from '../../../src/repositories/reviews.repository';

const mockPrisma = {
  reviews: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const reviewRepository = new ReviewRepository(mockPrisma);

describe('Review Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('createReview method test', async () => {
    const mockReturn = 'createReview String';
    mockPrisma.reviews.create.mockResolvedValue(mockReturn);

    const review = await reviewRepository.createReview(1, 1, '내용입니다?', '4');
    expect(review).toEqual(mockReturn);
    expect(mockPrisma.reviews.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.reviews.create).toHaveBeenCalledWith({
      data: {
        userId: +1,
        trainerId: +1,
        content: '내용입니다?',
        rating: '4',
      },
    });
  });

  it('findReviews method test', async () => {
    const mockReturn = 'findReviews String';
    mockPrisma.reviews.findMany.mockResolvedValue(mockReturn);

    const reviews = await reviewRepository.findReviews(1);

    expect(reviews).toEqual(mockReturn);
    expect(mockPrisma.reviews.findMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.reviews.findMany).toHaveBeenCalledWith({
      where: { trainerId: +1 },
      select: {
        reviewId: true,
        users: { select: { name: true } },
        rating: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it('findUserIdByReviewId method test', async () => {
    const mockReturn = 'findUserIdByReviewId String';
    mockPrisma.reviews.findUnique.mockResolvedValue(mockReturn);

    const user = await reviewRepository.findUserIdByReviewId(1);

    expect(user).toEqual(mockReturn);
    expect(mockPrisma.reviews.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrisma.reviews.findUnique).toHaveBeenCalledWith({
      where: {
        reviewId: +1,
      },
      select: {
        userId: true,
      },
    });
  });

  it('updateReview method test', async () => {
    const mockReturn = 'updateReview String';
    mockPrisma.reviews.update.mockResolvedValue(mockReturn);

    const review = await reviewRepository.updateReview(1, '내용입니다.', '5');

    expect(review).toEqual(mockReturn);
    expect(mockPrisma.reviews.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.reviews.update).toHaveBeenCalledWith({
      where: { reviewId: +1 },
      data: {
        content: '내용입니다.',
        rating: '5',
      },
      select: {
        reviewId: true,
        users: { select: { name: true } },
        rating: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  });

  it('deleteReview method test', async () => {
    const mockReturn = 'deleteReview String';
    mockPrisma.reviews.delete.mockResolvedValue(mockReturn);

    const review = await reviewRepository.deleteReview(1);

    expect(review).toEqual(mockReturn);
    expect(mockPrisma.reviews.delete).toHaveBeenCalledTimes(1);
    expect(mockPrisma.reviews.delete).toHaveBeenCalledWith({
      where: { reviewId: +1 },
    });
  });
});
