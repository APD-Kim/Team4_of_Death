import CustomError from '../utils/errorHandler.js';
export class ReservationController {
  constructor(reservationService, trainerService) {
    this.reservationService = reservationService;
    this.trainerService = trainerService;
  }
  reserveTrainer = async (req, res, next) => {
    //트레이너를 예약하려면 예약이 되어있는 기간에는 예약을 하면 안됨
    try {
      const { userId } = req.user;
      let { trainerId, startDate, endDate } = req.body;
      const reservedData = await this.reservationService.reserveDate(userId, trainerId, startDate, endDate);
      res.status(201).json({ message: '성공적으로 예약이 완료되었습니다.', data: reservedData });
    } catch (err) {
      next(err);
    }
  };

  getDates = async (req, res, next) => {
    try {
      const { trainerId } = req.body;
      const PossibleDates = await this.reservationService.findPossibleDates(trainerId);
      return res.status(200).json({ data: PossibleDates });
    } catch (err) {
      next(err);
    }
  };

  putReservation = async (req, res, next) => {
    try {
      const user = req.user;
      const { reservationId } = req.params;
      const { startDate, endDate } = req.body;

      const updateReservations = await this.reservationService.updateReservation(reservationId, startDate, endDate);
      return res.status(201).json({ message: '예약 날짜가 수정되었습니다.', data: updateReservations });
    } catch (err) {
      next(err);
    }
  };

  delReservation = async (req, res, next) => {
    try {
      const userId = req.user;
      console.log(userId);
      const { reservationId } = req.params;
      if (!reservationId) {
        throw new CustomError(404, '요청이 잘못 되었습니다.');
      }

      await this.reservationService.findReservationById(reservationId);

      return res.status(201).json({ message: '삭제 완료되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
}
