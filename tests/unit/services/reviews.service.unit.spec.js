import { ReviewService } from '../../../src/services/reviews.service.js';
import { beforeEach, describe, expect, jest } from '@jest/globals';
import CustomError from '../../../src/utils/errorHandler';

const mockReviewRepository = {
  createReview: jest.fn(),
  findReviews: jest.fn(),
  findUserIdByReviewId: jest.fn(),
  updateReview: jest.fn(),
  deleteReview: jest.fn(),
};

const reviewService = new ReviewService(mockReviewRepository);

describe('User Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('createReview method test', async () => {
    const mockReturn = {
      userId: 1,
      trainerId: 1,
      content: '리뷰 내용입니다.',
      rating: '4',
    };

    mockReviewRepository.createReview.mockResolvedValue(mockReturn);

    const review = await reviewService.createReview(mockReturn);
    expect(review).toEqual(mockReturn);
    expect(mockReviewRepository.createReview).toHaveBeenCalledTimes(1);
  });

  it('findReviews method test', async () => {
    const mockReturn1 = [
      {
        reviewId: 1,
        users: { name: '김라임' },
        rating: 3,
        content: '내용입니다.',
        createdAt: '2024-02-24T12:44:33.290Z',
        updatedAt: '2024-02-24T12:44:33.290Z',
      },
    ];

    const mockReturn2 = [
      {
        reviewId: 1,
        name: '김라임',
        rating: 3,
        content: '내용입니다.',
        createdAt: '2024-02-24T12:44:33.290Z',
        updatedAt: '2024-02-24T12:44:33.290Z',
      },
    ];

    mockReviewRepository.findReviews.mockResolvedValue(mockReturn1);

    const foundReviews = await reviewService.findReviews(1);
    expect(foundReviews).toEqual(mockReturn2);
    expect(mockReviewRepository.findReviews).toHaveBeenCalledTimes(1);
  });

  it('findUserIdByReviewId method test', async () => {
    const mockReturn = { userId: 1 };

    mockReviewRepository.findUserIdByReviewId.mockResolvedValue(mockReturn);

    const foundUser = await reviewService.findUserIdByReviewId(1);
    expect(foundUser).toEqual(mockReturn);
    expect(mockReviewRepository.findUserIdByReviewId).toHaveBeenCalledTimes(1);
  });

  it('updateReview method test', async () => {
    const mockReturn1 = {
      reviewId: 1,
      users: { name: '김라임' },
      content: '내용입니다.',
      rating: 3,
      createdAt: '1',
      updatedAt: '2024-02-24T12:44:33.290Z',
    };

    const mockReturn2 = {
      reviewId: 1,
      name: '김라임',
      content: '내용입니다.',
      rating: 3,
      createdAt: '1',
      updatedAt: '2024-02-24T12:44:33.290Z',
    };

    mockReviewRepository.updateReview.mockResolvedValue(mockReturn1);

    const updatedReview = await reviewService.updateReview(1, '내용입니다', '3');
    expect(updatedReview).toEqual(mockReturn2);
    expect(mockReviewRepository.updateReview).toHaveBeenCalledTimes(1);
  });

  it('deleteReview method test', async () => {
    const mockReturn1 = {};

    mockReviewRepository.deleteReview.mockResolvedValue(mockReturn1);

    const deleteReview = await reviewService.deleteReview(1);
    expect(deleteReview).toEqual(mockReturn1);
    expect(mockReviewRepository.deleteReview).toHaveBeenCalledTimes(1);
  });
});
