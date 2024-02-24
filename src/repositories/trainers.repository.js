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
}
