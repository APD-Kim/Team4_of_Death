import CustomError from '../utils/errorHandler.js'
export class ReviewController {

  constructor(reviewService) {
    this.reviewService = reviewService;
  }

  postReview = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { trainerId } = req.query; 
      const { content, rating } = req.body;
      
      if (!userId || !trainerId || !content || !rating) {
        throw new CustomError(404, '작성하신 리뷰 정보가 잘못 되었습니다.'); 
      }

      const review = await this.reviewService.createReview(trainerId, userId, content, rating);

      if(!review) {
        throw new CustomError(404, "리뷰 생성에 실패했습니다.")
      }

      if(rating < 0 || rating > 5){
        throw new CustomError(400, "평점은 1~5점 입니다.")
      }

      return res.status(201).json({ data: review });
    } catch (error) {
      next(error); 
    }
  }

  getReviews = async (req, res, next) => {
    try {
      const { trainerId } = req.query; 
    
      if (!trainerId) {
        throw new CustomError(404, '알 수 없는 펫시터입니다.'); 
      }
    
      const reviews = await this.reviewService.findReviews(trainerId); 
      
      if(!reviews) {
        throw new CustomError(404, "리뷰 조회에 실패했습니다.")
      } 

      return res.status(200).json({ data: reviews });

    } catch (error) {
      next(error);
    }
  };
  
  patchReview = async (req, res, next) => {
    try{
      const user = req.user;
      const { reviewId } = req.params;
      const { content, rating } = req.body;
  
      if (!reviewId || !content || !rating || !user.userId) {
        throw new CustomError(404, "수정하신 리뷰 정보가 잘못되었습니다.")
      }

      if(rating < 0 || rating > 5){
        throw new CustomError(400, "평점은 1~5점 입니다.")
      }

      const review = await this.reviewService.findUserIdByReviewId(reviewId);

      if(!review) {
        throw new CustomError(404, "해당 리뷰를 찾을 수 없습니다.")
      }
      
      console.log("user.userId:", user.userId)
      console.log("review.userId:", review.userId)

      if (user.userId !== review.userId) {
        throw new CustomError(400, '리뷰를 수정할 권한이 없습니다.')
      }
      
      const updateReview = await this.reviewService.updateReview(reviewId, content, rating);

      if (!updateReview) {
        throw new CustomError(404, "리뷰 수정에 실패했습니다.")
      }
  
      return res.status(200).json({ data: updateReview });

    } catch (error) {
      next(error); 
    }
  }; 

  deleteReview = async (req, res) => {
    try {
      const { reviewId } = req.params;
      const user = req.user;

      if (!reviewId || !user.userId) {
        throw new CustomError(404, "리뷰를 찾을 수 없습니다.")
      }
      
      const review = await this.reviewService.findUserIdByReviewId(reviewId);

      if (user.userId !== review.userId) {
        throw new CustomError(400, '리뷰를 수정할 권한이 없습니다.')
      }

      await this.reviewService.deleteReview(reviewId); 

      return res
        .status(201)
        .json({ success: true, message: '리뷰를 삭제하였습니다.' });
    } catch (error) {
      next(error);
    }
    
  };

}

