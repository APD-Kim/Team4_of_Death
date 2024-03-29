export class ReviewService {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  createReview = async (userId, trainerId, content, rating) => {
    const createdReview = await this.reviewRepository.createReview(userId, trainerId, content, rating);

    return createdReview;
  };

  findReviews = async (trainerId) => {
    const foundReviews = await this.reviewRepository.findReviews(trainerId);

    return foundReviews.map((e) => {
      return {
        reviewId: e.reviewId,
        name: e.users.name,
        rating: e.rating,
        content: e.content,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      };
    });
  };

  findUserIdByReviewId = async (reviewId) => {
    const foundReview = await this.reviewRepository.findUserIdByReviewId(reviewId);

    return foundReview;
  };

  updateReview = async (reviewId, content, rating) => {
    const updatedReview = await this.reviewRepository.updateReview(reviewId, content, rating);

    return {
      reviewId: updatedReview.reviewId,
      name: updatedReview.users.name,
      content: updatedReview.content,
      rating: updatedReview.rating,
      createdAt: updatedReview.createdAt,
      updatedAt: updatedReview.updatedAt,
    };
  };

  deleteReview = async (reviewId) => {
    const deletedReview = await this.reviewRepository.deleteReview(reviewId);

    return deletedReview;
  };
}
