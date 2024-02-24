import { expect, jest } from '@jest/globals';
import { ReviewController } from '../../../src/controllers/reviews.controller.js';
import CustomError from '../../../src/utils/errorHandler.js';

const mockReviewService = {
  createReview: jest.fn(),
  findReviews: jest.fn(), 
  findUserIdByReviewId: jest.fn(),
  updateReview: jest.fn(),
  deleteReview: jest.fn(),
};

const reviewController = new ReviewController(mockReviewService);

const mockRequest = {
  body: jest.fn(),
  params: jest.fn(),
  query: jest.fn(),
  user: jest.fn(),
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

const mockNext = jest.fn();

describe('User Controller Unit Test', () =>  {
  beforeEach(() => {
    jest.resetAllMocks();
    mockResponse.status.mockReturnValue(mockResponse);
  });

  it('postReview method test', async() => {
    const mockReturn = 'postReview complete';

    mockRequest.user = {
      userId: 2,
    }

    mockRequest.query = {
      trainerId: 1,
    }

    mockRequest.body = {
      content: "리뷰 내용입니다.",
      rating: "3",
    }

    mockReviewService.createReview.mockResolvedValue(mockReturn);
    await reviewController.postReview(mockRequest, mockResponse, mockNext);
    expect(mockReviewService.createReview).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201)
    expect(mockResponse.json).toHaveBeenCalledWith({ data: mockReturn })
  })
})