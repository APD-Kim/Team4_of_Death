import { ReservationRepository } from '../repositories/reservations.repository.js';

export class ReservationService {
  constructor(reservationRepository) {
    this.reservationRepository = reservationRepository;
  }

  findPossibleDates = async (trainerId) => {
    try {
      const PossibleDates = await this.reservationRepository.findPossibleDates(trainerId);
      return PossibleDates;

    } catch (err) {
      console.error("예약 가능한 날짜 조회 오류");
      next(err);
    }
  };
}
