import CustomError from "../utils/errorHandler.js";

export class PointController {

  constructor(pointService) {
    this.pointService = pointService;
  }
  addPoint = async (req, res, next) => {
    try {
      const { userId } = req.user;
      let { point, status, adjustment } = req.body;
      if (status && !["FILL", "REFUND", "CANCEL"].includes(status.toUpperCase())) {
        throw new CustomError(400, "적절하지 않은 형식입니다.")
      }
      if (adjustment && !["increment", "decrement"].includes(adjustment.toLowerCase())) {
        throw new CustomError(400, "적절하지 않은 형식입니다.")
      }
      status = status.toUpperCase();
      adjustment = adjustment.toLowerCase();

      const addPoint = await this.pointService.caculateUserPoint(userId, point, status, adjustment)
      res.status(200).json({ message: "포인트가 충전되었습니다.", data: addPoint })
    } catch (err) {
      next(err)
    }
  }
  subPoint = async (req, res, next) => {
    try {
      const { userId } = req.user;
      let { point, status, adjustment } = req.body;
      if (status && !["RESERVE"].includes(status.toUpperCase())) {
        throw new CustomError(400, "적절하지 않은 형식입니다.")
      }
      if (adjustment && !["increment", "decrement"].includes(adjustment.toLowerCase())) {
        throw new CustomError(400, "적절하지 않은 형식입니다.")
      }
      status = status.toUpperCase();
      adjustment = adjustment.toLowerCase();
      //만약 decrement일때 차감 메시지, increment일때 증가 메시지
      const subPoint = await this.pointService.caculateUserPoint(userId, point, status, adjustment)
      if (adjustment === "increment") {
        res.status(200).json({ message: "포인트 충전되었습니다.", data: subPoint })
      } else {
        res.status(200).json({ message: "포인트 차감되었습니다.", data: subPoint })
      }
    } catch (err) {
      next(err)
    }
  }
  showUserPoint = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const point = await this.pointService.showUserPoint(userId)
      res.status(200).json({ message: "현재 남은 포인트입니다.", data: point })
    } catch (err) {
      next(err)
    }
  }
  showPointHistory = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { orderBy, orderValue } = req.query;
      const pointHistory = await this.pointService.showPointHistory(userId)
      res.status(200).json({ data: pointHistory })
    } catch (err) {
      next(err)
    }
  }
}