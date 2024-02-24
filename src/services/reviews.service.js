export class ReviewService {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  // findTrainer = async (trainerId) => {
  //   const foundTrainer = await this.reviewRepository.findTrainer(trainerId);

  //   return foundTrainer; 
  // }

  // findUser = async (userId) => {
  //   const foundUser = await this.reviewRepository.findUser(userId);

  //   return foundUser; 
  // }

  createReview = async (trainerId, userId, content, rating) => {
    const createdReview = await this.reviewRepository.createReview(trainerId, userId, content, rating);

    return createdReview; 
  }

  findReviews = async () => {
    const foundReviews = await this.reviewRepository.findReviews(trainerId); 

    return foundReviews; 
  }

  findReview = async () => {
    const foundReview = await this.reviewRepository.findReview(reviewId)

    return foundReview; 
  }

  updateReview = async () => {
    const updatedReview = await this.reviewRepository.updateReview(reviewId, content, rating); 

    return updatedReview;
  }

  deleteReview = async () => {
    const deletedReview = await this.reviewRepository.deleteReview(reviewId);

    return deletedReview; 
  }
}