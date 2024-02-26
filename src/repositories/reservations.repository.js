export class ReservationRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  //1. 예약하기
  //2. 계산된 값만큼 포인트 차감하기,
  //3. 계산된 포인트에 대한 내역 생성
  reserveDate = async (userId, trainerId, startDate, endDate) => {
    const reserve = await this.prisma.reservations.create({
      data: {
        userId: Number(userId),
        trainerId: Number(trainerId),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
    return reserve;
  };

  searchDates = async (trainerId, startDate, endDate) => {
    const findDates = await this.prisma.reservations.findMany({
      where: {
        trainerId: Number(trainerId),
        AND: [
          {
            startDate: {
              lte: new Date(endDate),
            },
          },
          {
            endDate: {
              gte: new Date(startDate),
            },
          },
        ],
      },
    });
    return findDates;
  };

  findReservationById = async (reservationId) => {
    const findReservations = await this.prisma.reservations.findFirst({
      where: {
        reservationId: +reservationId,
      },
    });
    return findReservations;
  };

  findReservationByIdUnique = async (reservationId) => {
    const findReservations = await this.prisma.reservations.findUnique({
      where: {
        reservationId: +reservationId,
      },
    });
    return findReservations;
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

  updateReservation = async (reservationId, startDate, endDate) => {
    const updateReservations = await this.prisma.reservations.update({
      where: {
        reservationId: +reservationId,
      },
      data: {
        startDate,
        endDate,
      },
    });
    return updateReservations;
  };

  deleteReservation = async (reservationId) => {
    const delReservations = await this.prisma.reservations.delete({
      where: {
        reservationId: +reservationId,
      },
    });
    return delReservations;
  };
}
