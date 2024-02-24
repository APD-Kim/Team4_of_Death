export class ReservationRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 트래이너의 가능한 날짜 찾기
  findPossibleDates = async (trainerId) => {
    const today = new Date();
    const PossibleDates = await this.prisma.reservations.findMany({
      where: {
        trainerId: +trainerId,
        startDate: {
          gte: today.toISOString(),
        },
      },
      select: {
        reservationId: true,
        startDate: true,
        endDate: true,
        trainers: {
          petCategory: true,
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    return PossibleDates;
  };
}
