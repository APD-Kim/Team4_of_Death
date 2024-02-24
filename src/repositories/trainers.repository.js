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
        trainerId: Number(trainerId)
      }
    })
    console.log(trainer);
    return trainer;
  }

  existLike = async (userId, trainerId) => {
    const trainer = await this.prisma.likes.findFirst({
      where: {
        userId: +userId,
        trainerId: +trainerId
      }
    });
    return trainer;
  }

  cancelLikeTrainer = async (userId, trainerId) => {
    const cancelLike = await this.prisma.likes.delete({
      where: {
        userId_trainerId: {
          userId: +userId,
          trainerId: +trainerId
        },
      },
    })
    return cancelLike
  }

}
