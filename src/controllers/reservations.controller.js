import { ReservationService } from '../services/reservations.service.js';

export class ReservationController {
  constructor(reservationService) {
    this.reservationService = reservationService;
  }

  getDates = async (req, res, next) => {
    try {
      // url 에서 입력하는게 맞겠지?
      const { trainerId } = req.body;
      const PossibleDates = await this.reservationService.findPossibleDates(trainerId);
      return res.status(200).json({ data: PossibleDates });

    } catch (err) {
      next(err);
    }
  };
}
