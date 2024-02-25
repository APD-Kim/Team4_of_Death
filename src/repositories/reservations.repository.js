export class ReservationRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findReservationById = async (reservationId) => {
    const findReservations = await this.prisma.reservations.findFirst({
      where: {
        reservationId: +reservationId,
      },
    });
    return findReservations;
  };

  findReservationByIdUnique = async(reservationId) => {
    const findReservations = await this.prisma.reservations.findUnique({
      where: {
        reservationId: +reservationId,
      }
    })
    return findReservations;
  }

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
  
  deleteReservation = async(reservationId) => {
    const delReservations = await this.prisma.reservations.delete({
      where: {
        reservationId: +reservationId,
      }
    })
    return delReservations;
  }

}
