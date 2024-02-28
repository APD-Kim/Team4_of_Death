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

  isReservatedDate = async (trainerId, startDate, endDate) => {
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
    if (findDates.length === 0) {
      return false;
    } else {
      return true;
    }
  };

  // 예약 가능한 날짜 찾기
  findTrainerPossibleReservations = async (trainerId, startDate, endDate) => {
    const possibleDates = await this.prisma.reservations.findMany({
      where: {
        trainerId: +trainerId,
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
    return possibleDates;
  };

  // 트레이너에 예약 된 날짜 찾기
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

  findReservationDates = async (trainerId) => {
    const reservationDates = await this.prisma.reservations.findMany({
      where: {
        trainerId: +trainerId,
      },
      select: {
        reservationId: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        updatedAt: true,
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
    return reservationDates;
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
