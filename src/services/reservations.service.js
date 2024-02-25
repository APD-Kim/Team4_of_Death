import { ReservationRepository } from '../repositories/reservations.repository.js';
import CustomError from '../utils/errorHandler.js';

export class ReservationService {
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  findPossibleDates = async (trainerId) => {

      const PossibleDates = await this.reservationRepository.findPossibleDates(trainerId);

      return PossibleDates.map((reservation) => ({
        reservationId: reservation.reservationId,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        petCategory: reservation.trainers.petCategory,
      }));

  };
  
  findReservationById = async(reservationId) => {
    const findReservations = await this.reservationRepository.findReservationById(reservationId);
    return findReservations;
  }

  updateReservation = async(
    userId,
    reservationId,
    startDate,
    endDate,
  ) => {
    const findReservation = await this.reservationRepository.findReservationByIdUnique(reservationId);
    if (userId !== findReservation.userId){
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

  deleteReservation = async(reservationId, userId) => {
    await this.reservationRepository.deleteReservation(reservationId)
    return {message: '예약 정보를 삭제하였습니다.'}
  }
}
