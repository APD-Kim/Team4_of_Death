export class ReviewRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createReview = async (trainerId, userId, content, rating) => {
    const review = await this.prisma.reviews.create({
      data: {
        userId: +userId,
        trainerId: +trainerId, 
        content, 
        rating,
      }
    })

    return review
  }

  findReviews = async (trainerId) => {
    const review = await this.prisma.reviews.findMany({
      where: {trainerId: +trainerId},
      select: {
        reviewId: true,
        users: {select: {name: true}},
        rating: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return review
  }

  findUserIdByReviewId = async (reviewId) => {
    const review = await this.prisma.reviews.findUnique({
      where: {
        reviewId: +reviewId
      },
      select: {
        userId: true,
      } 
    }) 

    return review
  }


  updateReview = async (reviewId, content, rating) => {
    const review = await this.prisma.reviews.update({
        where: {reviewId: +reviewId}, 
        data: {
          content, 
          rating,
        },
        select: {
          reviewId: true,
          users: {select: {name: true}},
          rating: true,
          content: true,
          createdAt: true,
          updatedAt: true,
        }
    })

    return review;
  }

  deleteReview = async (reviewId) => {
    const review = await this.prisma.reviews.delete({
      where: {reviewId: +reviewId}
    })

    return review;
  }    
}