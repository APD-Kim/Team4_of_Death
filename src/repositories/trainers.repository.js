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
    await this.prisma.users.update({
      where: {
        userId: +userId,
      },
      data: {
        isTrainer: true,
      },
    });
    return trainer;
  };

  findAllTrainer = async () => {
    const trainer = await this.prisma.trainers.findMany({
      include: {
        users: true,
      },
    });
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
    console.log('findTrainerByCategory');
    console.log(category);
    const trainerList = await this.prisma.trainers.findMany({
      select: {
        where: {
          petCategory: category,
        },
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
    console.log('trainerList', trainerList);
    return trainerList;
  };

  findOneUser = async (userId) => {
    const trainer = await this.prisma.trainers.findFirst({
      where: {
        userId: +userId,
      },
      include: {
        users: true,
      },
    });
    return trainer;
  };

  LikeTrainer = async (userId, trainerId) => {
    const trainer = await this.prisma.likes.create({
      data: {
        userId: Number(userId),
        trainerId: Number(trainerId),
      },
    });
    console.log(trainer);
    return trainer;
  };

  existLike = async (userId, trainerId) => {
    const trainer = await this.prisma.likes.findFirst({
      where: {
        userId: +userId,
        trainerId: +trainerId,
      },
    });
    return trainer;
  };

  cancelLikeTrainer = async (userId, trainerId) => {
    const cancelLike = await this.prisma.likes.delete({
      where: {
        userId_trainerId: {
          userId: +userId,
          trainerId: +trainerId,
        },
      },
    });
    return cancelLike;
  };

  updateTrainer = async (trainerId, career, petCategory, address, price) => {
    const trainer = await this.prisma.trainers.update({
      where: {
        trainerId: +trainerId,
      },
      data: {
        career,
        petCategory,
        address,
        price,
      },
    });
    return trainer;
  };

  deleteTrainer = async (trainerId) => {
    const trainer = await this.prisma.trainers.delete({
      where: {
        trainerId: +trainerId,
      },
    });
    return trainer;
  };

  findTrainersNoDate = async (startTime, endTime) => {
    const noReservation = await this.prisma.trainers.findMany({
      where: {
        NOT: {
          reservations: {
            some: {
              AND: [{ startDate: { lte: endTime } }, { endDate: { gte: startTime } }],
            },
          },
        },
      },
      select: {
        trainerId: true,
        users: { select: { name: true } },
        petCategory: true,
        price: true,
        career: true,
      },
    });

    return noReservation;
  };
}
