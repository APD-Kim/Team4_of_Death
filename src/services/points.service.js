import CustomError from '../utils/errorHandler.js';

export class PointService {
  constructor(pointRepository, userRepository) {
    this.pointRepository = pointRepository;
    this.userRepository = userRepository;
  }

  calculateUserPoint = async (userId, point, status, adjustment) => {
    const result = await this.pointRepository.calculatePoint(userId, point, status, adjustment);
    return {
      point: result.updatedResultPoint.point,
      status: result.createdHistory.status,
      pointChanged: result.createdHistory.pointChanged,
      createdAt: result.createdHistory.createdAt,
    };
  };
  showUserPoint = async (userId) => {
    const point = await this.pointRepository.searchPoint(userId);
    return {
      point: point.point,
      updatedAt: point.updatedAt,
    };
  };

  showPointHistory = async (userId, orderBy) => {
    if (orderBy && !['desc', 'asc'].includes(orderBy.toLowerCase())) {
      throw new CustomError(400, '정확한 정렬 방식을 사용해주세요.');
    }
    const findUser = await this.userRepository.findUserByUserId(userId);
    const { pointId } = findUser.points;
    const pointHistory = await this.pointRepository.searchPointHistory(pointId, orderBy);
    return pointHistory.map((e) => {
      return {
        historyId: e.historyId,
        pointChanged: e.pointChanged,
        point: e.point,
        status: e.status,
        createdAt: e.createdAt,
      };
    });
  };
}
