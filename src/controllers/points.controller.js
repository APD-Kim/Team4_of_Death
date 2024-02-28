import CustomError from '../utils/errorHandler.js';

export class PointController {
  constructor(pointService) {
    this.pointService = pointService;
  }
  calculatePoint = async (req, res, next) => {
    try {
      const { userId } = req.user;
      let { point, status, adjustment } = req.body;
      if (status && !['FILL', 'REFUND', 'CANCEL', 'RESERVE'].includes(status.toUpperCase())) {
        throw new CustomError(400, '적절하지 않은 형식입니다.');
      }
      if (adjustment && !['increment', 'decrement'].includes(adjustment.toLowerCase())) {
        throw new CustomError(400, '적절하지 않은 형식입니다.');
      }
      console.log(status);
      status = status.toUpperCase();
      adjustment = adjustment.toLowerCase();
      const caclulatedPoint = await this.pointService.calculateUserPoint(userId, point, status, adjustment);
      if (adjustment === 'increment') {
        res.status(200).json({ message: '포인트가 충전되었습니다.', data: caclulatedPoint });
      } else {
        res.status(200).json({ message: '포인트가 차감되었습니다.', data: caclulatedPoint });
      }
    } catch (err) {
      next(err);
    }
  };

  showUserPoint = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const point = await this.pointService.showUserPoint(userId);
      res.status(200).json({ message: '현재 남은 포인트입니다.', data: point });
    } catch (err) {
      next(err);
    }
  };
  showPointHistory = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const orderBy = req.query.orderBy ?? 'desc';
      const pointHistory = await this.pointService.showPointHistory(userId, orderBy);
      res.status(200).json({ data: pointHistory });
    } catch (err) {
      next(err);
    }
  };
}
