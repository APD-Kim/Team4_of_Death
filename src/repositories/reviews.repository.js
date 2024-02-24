export class ReviewRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createReview = async (trainerId, userId, content, rating) => {
    const review = await this.prisma.reviews.create({
      data: {
        userId, 
        trainerId, 
        content, 
        rating,
        createdAt,
      }
    })

    return review
  }

  findReviews = async (trainerId) => {
    const review = await this.prisma.reviews.findMany({
      where: {trainerId: +trainerId},
      select: {
        user: {
          select: {name: true}
        },
        rating: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    return review
  }

  findReview = async (reviewId) => {
    const review = await this.prisma.reviews.findUnique({
      where: {
        reviewId: +reviewId
      },
      select: {
        userId: true,
        content: true, 
        rating: true,
      } 
    }) 

    return review
  }


  updateReview = async (reviewId, content, rating) => {
    const review = await this.prisma.reviews.update({
      where: {reviewId: +reviewId}, 
      select: {
        content, 
        rating, 
        updatedAt,
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