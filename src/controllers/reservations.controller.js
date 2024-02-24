import CustomError from "../utils/errorHandler";

export class ReservationController {

  constructor(reservationService, trainerService) {
    this.reservationService = reservationService;
    this.trainerService = trainerService;
  }
  reserveTrainer = async (req, res, next) => {
    //트레이너를 예약하려면 예약이 되어있는 기간에는 예약을 하면 안됨
    const { userId } = req.user;
    const { trainerId, startDate, endDate } = req.body;
    const findTrainer = await this.trainerService.findOneTrainer(trainerId);
    if (!findTrainer) throw new CustomError(404, "해당 트레이너를 찾을 수 없습니다.")
    //트레이너가 있다면
    

  }
}