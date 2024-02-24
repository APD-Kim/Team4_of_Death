export class TrainerRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  registerTrainer = async (userId, price, career, petCategory, address) => {
    const trainer = await this.prisma.trainers.create({
      data: {
        userId,
        price,
        career,
        petCategory,
        address,
      },
    });
    return trainer;
  };

  findAllTrainer = async () => {
    const trainer = await this.prisma.trainers.findMany();
    return trainer;
  };

  findOneTrainer = async (trainerId) => {
    const trainer = await this.prisma.trainers.findFirst({
      where: {
        trainerId: +trainerId,
      },
      include: {
        users: true,
      },
    });
    return trainer;
  };

  /**카테고리별 펫시터 조회 */
  findTrainerByCategory = async (category) => {
    const trainerList = await this.prisma.trainers.findMany({
      where: {
        petCategory: category,
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
