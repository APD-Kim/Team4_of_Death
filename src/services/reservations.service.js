import CustomError from '../utils/errorHandler.js';

export class ReservationService {
  constructor(reservationRepository, trainerRepository, pointRepository) {
    this.reservationRepository = reservationRepository;
    this.trainerRepository = trainerRepository;
    this.pointRepository = pointRepository;
  }
  reserveDate = async (userId, trainerId, startDate, endDate) => {
    //1. startDate와 endDate에 대한 유효성 검사를 한다.
    //2. 유저의 포인트와 트레이너의 존재여부를 확인한다.
    //3. 포인트가 충분한지 확인한다.
    //4. 예약을 한다.
    //5. 유저의 포인트를 깎고 pointHistory를 생성한다.
    //6. 가공된 리턴값을 컨트롤러에 반환한다.
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    const regexStart = regex.test(startDate);
    const regexEnd = regex.test(endDate);
    if (!regexStart || !regexEnd) {
      throw new CustomError(400, '날짜 형식이 잘못 됐습니다.');
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    if (start > end) {
      throw new CustomError(400, '시작 날짜는 반드시 종료 날짜보다 전이어야 합니다.');
    }
    if (today > start || today > end) {
      throw new CustomError(400, '과거의 날짜를 예약할 수 없습니다.');
    }
    const user = await this.pointRepository.searchPoint(userId);
    const userPoint = user.point;
    const trainer = await this.trainerRepository.findOneTrainer(trainerId);
    if (!trainer) {
      throw new CustomError(404, '해당 트레이너를 찾을 수 없습니다.');
    }
    const { price } = trainer; // 3 * 600
    const daysDiff = Math.round((end - start) / (1000 * 60 * 60 * 24) + 1);
    const totalPrice = daysDiff * price;
    const isPossibleDates = await this.reservationRepository.isReservatedDate(trainerId, startDate, endDate);
    if (isPossibleDates === true) throw new CustomError(409, '이미 예약되어있습니다.');
    if (daysDiff > 7) throw new CustomError(400, '7일 이상 예약할 수 없습니다.');
    //예약이 없다면 예약을 시켜줘야함

    if (totalPrice > userPoint) {
      throw new CustomError(400, '포인트가 충분하지 않습니다.');
    }
    startDate = startDate + 'T00:00:00Z';
    endDate = endDate + 'T23:59:59Z';
    const reservedDate = await this.reservationRepository.reserveDate(userId, trainerId, startDate, endDate);
    const status = 'RESERVE';
    const adjustment = 'decrement';
    const subPoint = await this.pointRepository.calculatePoint(userId, totalPrice, status, adjustment);
    return {
      trainerId: reservedDate.trainerId,
      startDate: reservedDate.startDate,
      endDate: reservedDate.endDate,
      status: reservedDate.status,
      createdAt: reservedDate.createdAt,
      currentPoint: subPoint.updatedResultPoint.point,
      totalPrice: subPoint.createdHistory.pointChanged,
    };
  };

  // 트레이너의 예약 가능한 날짜 찾기
  findPossibleDatesForTrainer = async (trainerId) => {
    const today = new Date();
    const endDate = new Date();
    // setFullYert 메서드는 현재 날짜에서 1년 후 날짜 까지 예약 가능한 날짜 조회 하는 메서드
    endDate.setFullYear(today.getFullYear() + 1);
    // toLocaleDateString 을 쓰면 보기 좋은 날짜로 변환됨.
    const startDate = today.toISOString();

    const trainer = await this.trainerRepository.findOneTrainer(trainerId);
    if (!trainer) {
      throw new CustomError(404, '해당 트레이너를 찾을 수 없습니다.');
    }

    const reservations = await this.reservationRepository.findTrainerPossibleReservations(
      trainerId,
      startDate,
      endDate
    );
    const possibleDates = [];
    for (let i = 0; i < 365; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const isPossible = reservations.every((reservation) => {
        const reservationStartDate = new Date(reservation.startDate);
        const reservationEndDate = new Date(reservation.endDate);
        return currentDate < reservationStartDate || currentDate > reservationEndDate;
      });
      if (isPossible) {
        possibleDates.push(currentDate.toISOString());
      }
    }
    return possibleDates;
  };

  findReservationDates = async (trainerId) => {
    const reservationDates = await this.reservationRepository.findReservationDates(trainerId);
    return reservationDates.map((reservation) => ({
      reservationId: reservation.reservationId,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      petCategory: reservation.trainers.petCategory,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    }));
  };

  findReservationById = async (reservationId) => {
    const findReservations = await this.reservationRepository.findReservationById(reservationId);
    return findReservations;
  };

  findReservationByIdUnique = async (reservationId) => {
    const reservations = await this.reservationRepository.findReservationByIdUnique(reservationId);

    return reservations;
  };

  updateReservation = async (reservationId, startDate, endDate) => {
    const updateReservations = await this.reservationRepository.updateReservation(reservationId, startDate, endDate);
    return {
      reservationId: updateReservations.reservationId,
      startDate: updateReservations.startDate,
      endDate: updateReservations.endDate,
    };
  };

  deleteReservation = async (reservationId) => {
    const deletedReservation = await this.reservationRepository.deleteReservation(reservationId);
    return deletedReservation;
  };
}
