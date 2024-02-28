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

describe('Review Controller Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockResponse.status.mockReturnValue(mockResponse);
  });

  it('postReview method', async () => {
    const mockReturn = 'postReview complete';

    mockRequest.user = {
      userId: 2,
    };

    mockRequest.params = {
      trainerId: 1,
    };

    mockRequest.body = {
      content: '리뷰 내용입니다.',
      rating: '3',
    };

    mockReviewService.createReview.mockResolvedValue(mockReturn);
    await reviewController.postReview(mockRequest, mockResponse, mockNext);
    expect(mockReviewService.createReview).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: mockReturn });
  });
  // content 누락된 경우
  it('throws error if request data is invalid in method postReview', async () => {
    mockRequest.user = { userId: 2 };
    mockRequest.params = { trainerId: 1 };
    mockRequest.body = { rating: '3' };

    await reviewController.postReview(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new CustomError(404, '작성하신 리뷰 정보가 잘못 되었습니다.'));
    expect(mockReviewService.createReview).not.toHaveBeenCalled(); // createReview가 호출되지 않은 것을 확인
  });
  // 리뷰가 생성이 안 된 경우
  it('throws error if review creation fails in method postReview', async () => {
    mockReviewService.createReview.mockResolvedValue(null);

    mockRequest.user = { userId: 2 };
    mockRequest.params = { trainerId: 1 };
    mockRequest.body = { content: '리뷰 내용입니다.', rating: '3' };

    await reviewController.postReview(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new CustomError(404, '리뷰 생성에 실패했습니다.'));
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });
  // 평점이 잘못된 경우
  it('throws error if rating is out of range in method postReview', async () => {
    mockRequest.user = { userId: 2 };
    mockRequest.params = { trainerId: 1 };
    mockRequest.body = { content: '리뷰 내용입니다.', rating: '6' };

    await reviewController.postReview(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new CustomError(400, '평점은 1~5점 입니다.'));
    expect(mockReviewService.createReview).not.toHaveBeenCalled();
  });

  it('getReviews method test', async () => {
    const mockReturn = 'getReviews complete';

    mockReviewService.findReviews.mockResolvedValue(mockReturn);

    await reviewController.getReviews(mockRequest, mockResponse, mockNext);
    expect(mockReviewService.findReviews).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: mockReturn });
  });

  it('throw error if request trainerId is invalid in method getReviews', async () => {
    mockRequest.params = {};

    await reviewController.getReviews(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new CustomError(404, '알 수 없는 펫시터입니다.'));
    expect(mockReviewService.findReviews).not.toHaveBeenCalled();
  });

  it('throw error if review is invalid in method getReviews', async () => {
    mockRequest.params = { trainerId: 1 };

    await reviewController.getReviews(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new CustomError(404, '리뷰 조회에 실패했습니다.'));
    expect(mockReviewService.findReviews).toHaveBeenCalledTimes(1);
  });

  it('patchReview method test', async () => {
    const mockReturn = 'patchReview complete';
    //const mockUserId = { userId: 1 };
    mockRequest.params = { reviewId: 3 };
    mockRequest.user = { userId: 1 };
    mockRequest.body = {
      content: '뭐여',
      rating: '3',
    };
    const mockFoundUserId = { userId: 1 };

    mockReviewService.findUserIdByReviewId.mockResolvedValue(mockFoundUserId); //mockUserId
    mockReviewService.updateReview.mockResolvedValue(mockReturn);

    await reviewController.patchReview(mockRequest, mockResponse, mockNext);
    expect(mockReviewService.findUserIdByReviewId).toHaveBeenCalledTimes(1);
    expect(mockReviewService.updateReview).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: mockReturn });
  });

  it('throw error if request parameters(rating) are invalid in method patchReview', async () => {
    mockRequest.user = { userId: 1 };
    mockRequest.params = { reviewId: 1 };
    mockRequest.body = { content: '내용입니다?' };

    await reviewController.patchReview(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new CustomError(404, '수정하신 리뷰 정보가 잘못되었습니다.'));
    expect(mockReviewService.findUserIdByReviewId).not.toHaveBeenCalled();
  });

  it('throw error if request rating is out of range in method patchReview', async () => {
    mockRequest.user = { userId: 1 };
    mockRequest.params = { reviewId: 1 };
    mockRequest.body = { content: '내용입니다?', rating: '6' };

    await reviewController.patchReview(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new CustomError(400, '평점은 1~5점 입니다.'));
    expect(mockReviewService.findUserIdByReviewId).not.toHaveBeenCalled();
  });

  it('throw error if foundUserId is invalid in method patchReview', async () => {
    mockRequest.user = { userId: 1 };
    mockRequest.params = { reviewId: 1 };
    mockRequest.body = { content: '내용입니다?', rating: '4' };
    const mockFoundUserId = { userId: 1 };

    await reviewController.patchReview(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new CustomError(404, '해당 리뷰의 사용자를 찾을 수 없습니다.'));
    expect(mockReviewService.findUserIdByReviewId).toHaveBeenCalledTimes(1);
  });

  it('throw error if userId of user is not equal userId of review in method patchReview', async () => {
    mockRequest.user = { userId: 2 };
    mockRequest.params = { reviewId: 1 };
    mockRequest.body = { content: '내용입니다?', rating: '4' };
    const mockFoundUserId = { userId: 1 };
    mockReviewService.findUserIdByReviewId.mockResolvedValue(mockFoundUserId);

    await reviewController.patchReview(mockRequest, mockResponse, mockNext);

    expect(mockReviewService.findUserIdByReviewId).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(new CustomError(400, '리뷰를 수정할 권한이 없습니다.'));
  });

  it('throw error if updateReview is invalid in method patchReview', async () => {
    mockRequest.user = { userId: 2 };
    mockRequest.params = { reviewId: 1 };
    mockRequest.body = { content: '내용입니다?', rating: '4' };
    const mockFoundUserId = { userId: 2 };

    mockReviewService.findUserIdByReviewId.mockResolvedValue(mockFoundUserId);

    await reviewController.patchReview(mockRequest, mockResponse, mockNext);

    expect(mockReviewService.findUserIdByReviewId).toHaveBeenCalledTimes(1);
    expect(mockReviewService.updateReview).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(new CustomError(404, '리뷰 수정에 실패했습니다.'));
  });

  it('throw error if updateReview is invalid in method patchReview', async () => {
    mockRequest.user = { userId: 2 };
    mockRequest.params = { reviewId: 1 };
    mockRequest.body = { content: '내용입니다?', rating: '4' };
    const mockFoundUserId = { userId: 2 };

    mockReviewService.findUserIdByReviewId.mockResolvedValue(mockFoundUserId);

    await reviewController.patchReview(mockRequest, mockResponse, mockNext);

    expect(mockReviewService.findUserIdByReviewId).toHaveBeenCalledTimes(1);
    expect(mockReviewService.updateReview).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(new CustomError(404, '리뷰 수정에 실패했습니다.'));
  });

  it('deleteReview method test', async () => {
    const mockReturn = 'deleteReview complete';
    const mockReturn2 = { userId: 1 };
    mockRequest.params = { reviewId: 3 };
    mockRequest.user = { userId: 1 };

    mockReviewService.findUserIdByReviewId.mockResolvedValue(mockReturn2);
    mockReviewService.deleteReview.mockResolvedValue(mockReturn);

    await reviewController.deleteReview(mockRequest, mockResponse, mockNext);
    expect(mockReviewService.findUserIdByReviewId).toHaveBeenCalledTimes(1);
    expect(mockReviewService.deleteReview).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ success: true, message: '리뷰를 삭제하였습니다.' });
  });

  it('throw error if parameters are invalid', async () => {
    mockRequest.params = {};
    mockRequest.user = { userId: 1 };

    await reviewController.deleteReview(mockRequest, mockResponse, mockNext);
    expect(mockReviewService.findUserIdByReviewId).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(new CustomError(404, '리뷰를 찾을 수 없습니다.'));
  });

  it('throw error if userId of user is not equal userId of foundUserId', async () => {
    mockRequest.params = { reviewId: 1 };
    mockRequest.user = { userId: 1 };
    const mockFoundUserId = { userId: 2 };

    mockReviewService.findUserIdByReviewId.mockResolvedValue(mockFoundUserId);
    await reviewController.deleteReview(mockRequest, mockResponse, mockNext);
    expect(mockReviewService.findUserIdByReviewId).toHaveBeenCalledTimes(1);
    expect(mockNext).toHaveBeenCalledWith(new CustomError(400, '리뷰를 수정할 권한이 없습니다.'));
  });
});
