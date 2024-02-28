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

  findPossibleDatesForTrainer = async(req, res, next) => {
    try{
      const {trainerId} = req.params;
      const possibleDates = await this.reservationService.findPossibleDatesForTrainer(trainerId);
      return res.status(200).json({data: possibleDates});
    } catch(err) {
      next(err);
    }
  }

  getDates = async (req, res, next) => {
    try {
      const { trainerId } = req.body;
      const reservationDates = await this.reservationService.findReservationDates(trainerId);
      if(reservationDates.length === 0) {
        throw new CustomError(404, '예약 된 내역이 존재하지 않습니다.')
      }

      return res.status(200).json({ data: reservationDates });
    } catch (err) {
      next(err);
    }
  };

  putReservation = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { reservationId } = req.params;
      const { startDate, endDate } = req.body;

      const reservations = await this.reservationService.findReservationByIdUnique(reservationId);

      if (!reservations) {
        throw new CustomError(404, '수정할 예약 내역이 존재하지 않습니다.');
      }

      if (userId !== reservations.userId) {
        throw new CustomError(400, '예약을 수정할 권한이 없습니다.');
      }
      const updateReservations = await this.reservationService.updateReservation(reservationId, startDate, endDate);
      return res.status(201).json({ message: '예약 날짜가 수정되었습니다.', data: updateReservations });
    } catch (err) {
      next(err);
    }
  };

  delReservation = async (req, res, next) => {
    try {
      const { userId } = req.user;

      const { reservationId } = req.params;

      if (!reservationId || !userId) {
        throw new CustomError(404, '요청이 잘못 되었습니다.');
      }

      const reservation = await this.reservationService.findReservationByIdUnique(reservationId);

      if (!reservation) {
        throw new CustomError(404, '해당 예약 내역이 존재하지 않습니다.');
      }

      if (userId !== reservation.userId) {
        throw new CustomError(400, '예약 삭제할 권한이 없습니다.');
      }

      await this.reservationService.deleteReservation(reservationId);

      return res.status(201).json({ message: '삭제 완료되었습니다.' });
    } catch (err) {
      next(err);
    }
  };
}
