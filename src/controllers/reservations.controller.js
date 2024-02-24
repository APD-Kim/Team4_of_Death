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

  putReservation = async (req, res, next) => {
    try {
      const  user = req.user;
      const { reservationId } = req.params;
      const { startDate, endDate } = req.body;

      const updateReservations = await this.reservationService.updateReservation(
        reservationId,
        startDate,
        endDate
      );
      return res.status(201).json({ message: '예약 날짜가 수정되었습니다.', data: updateReservations });
    } catch (err) {
      next(err);
    }
  };

  delReservation = async(req, res, next) => {
    try{
      const user = req.user;
      const { reservationId } = req.params;

      await this.reservationService.findReservationById(reservationId);
      return res.status(201).json({message: '예약 정보를 삭제하였습니다.'})
    } catch (err) {
      next(err);
    }
  } 

}
