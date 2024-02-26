import { ReservationRepository } from '../repositories/reservations.repository.js';
import CustomError from '../utils/errorHandler.js';

export class ReservationService {
  constructor(reservationRepository, trainerRepository, userRepository) {
    this.reservationRepository = reservationRepository;
    this.trainerRepository = trainerRepository;
    this.userRepository = userRepository
  }
  reserveDate = async (userId, trainerId, startDate, endDate) => {
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
    const regexStart = regex.test(startDate);
    const regexEnd = regex.test(endDate);
    if (!regexStart || !regexEnd) {
      throw new CustomError(400, "날짜 형식이 잘못 됐습니다.")
    }
    if (new Date(startDate) > new Date(endDate)) {
      throw new CustomError(400, "시작 날짜는 반드시 종료 날짜보다 전이어야 합니다.")
    }

    const userPoint = await this.userRepository.findUserByUserId(userId)
    console.log(userPoint);
    const trainer = await this.trainerRepository.findOneTrainer(trainerId)
    if (!trainer) {
      throw new CustomError(404, "해당 트레이너를 찾을 수 없습니다.");
    }
    console.log(trainer);
    const { price } = trainer;
    const daysDiff = Math.round((new Date(endDate) - new Date(startDate) / 1000 * 60 * 60 * 24) + 1)
    if (price * daysDiff) {
      startDate = startDate + "T08:00:00Z"
      endDate = endDate + "T20:00:00Z"


    }
    //시작날과 끝 날 사이에 예약이 잡혀있는지 확인 <-- 
    //시작날과 종료날 사이에 예약이 잡혀있는지 확인
    const possibleDates = await this.reservationRepository.searchDates(trainerId, startDate, endDate)
    if (possibleDates.length !== 0) throw new CustomError(409, "이미 예약되어있습니다.")
    //예약이 없다면 예약을 시켜줘야함
    const reservedDate = await this.reservationRepository.reserveDate(userId, trainerId, startDate, endDate)
    return reservedDate;
  }

  findPossibleDates = async (trainerId) => {
    try {
      const PossibleDates = await this.reservationRepository.findPossibleDates(trainerId);

      return PossibleDates.map((reservation) => ({
        reservationId: reservation.reservationId,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        petCategory: reservation.trainers.petCategory,
      }));
    } catch (err) {
      console.error('예약 가능한 날짜 조회 오류');
      next(err);
    }
  };

  findReservationById = async (reservationId) => {
    const findReservations = await this.reservationRepository.findReservationById(reservationId);
    return findReservations;
  }

  updateReservation = async (
    userId,
    reservationId,
    startDate,
    endDate,
  ) => {
    const findReservation = await this.reservationRepository.findReservationByIdUnique(reservationId);
    if (userId !== findReservation.userId) {
      throw new CustomError(404, '해당 예약에 권한이 없습니다.');
    }

    const updateReservations = await this.reservationRepository.update(
      reservationId,
      startDate,
      endDate,
    );
    return {
      reservationId: updateReservations.reservationId,
      startDate: updateReservations.startDate,
      endDate: updateReservations.endDate,
    }
  }

  deleteReservation = async (reservationId, userId) => {
    await this.reservationRepository.deleteReservation(reservationId)
    return { message: '예약 정보를 삭제하였습니다.' }
  }
}
