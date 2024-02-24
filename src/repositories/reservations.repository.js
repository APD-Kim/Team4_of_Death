export class ReservationRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findReservationById = async (reservationId) => {
    const findReservation = await this.prisma.reservations.findFirst({
      where: {
        reservationId: +reservationId,
      },
    });
    return findReservation;
  };

  // 트래이너의 가능한 날짜 찾기
  findPossibleDates = async (trainerId) => {
    const today = new Date();
    const PossibleDates = await this.prisma.reservations.findMany({
      where: {
        trainerId: +trainerId,
        // startDate: {
        //   gte: today.toISOString(), //
        // },
      },
      select: {
        reservationId: true,
        startDate: true,
        endDate: true,
        trainers: {
          select: {
            petCategory: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    return PossibleDates;
  };

  findReservationUnique = async (reservationId, startDate, endDate) => {
    const updateReservation = await this.prisma.reservations.findUnique({
      where: {
        reservationId: +reservationId,
      },
      data: {
        startDate,
        endDate,
      },
    });
    return updateReservation;
  };
}
