export class TrainerRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  registerTrainer = async (userId, trainerName, price, career, petCategory, address) => {
    const trainer = await this.prisma.trainers.create({
      data: {
        userId,
        trainerName,
        price,
        career,
        petCategory,
        address,
      },
    });
    return trainer;
  };

  /**카테고리별 펫시터 조회 */
  findTrainerByCategory = async (category) => {
    const trainerList = await this.prisma.trainers.findMany({
      where: {
        petCategory: 'cag',
      },

      select: {
        userId: true,
        career: true,
        petCategory: true,
        address: true,
        createdAt: true,
        price: true,
        reviews: {
          select: {
            content: true,
            rating: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
      },
    });
    return trainerList;
  };
}
