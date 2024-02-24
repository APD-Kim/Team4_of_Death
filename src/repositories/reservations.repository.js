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
          gte: today.toISOString(), // 오늘 이후의 날짜부터 보여줌
        },
      },
      select: {
        reservationId: true,
        startDate: true,
        endDate: true,
        users: true,
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    return PossibleDates;
  };
}
