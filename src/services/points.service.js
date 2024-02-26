import CustomError from '../utils/errorHandler.js';

export class PointService {
  constructor(pointRepository, userRepository) {
    this.pointRepository = pointRepository;
    this.userRepository = userRepository;
  }

  caculateUserPoint = async (userId, point, status, adjustment) => {
    const findUser = await this.userRepository.findUserByUserId(userId);
    if (!findUser) {
      throw new CustomError(404, '해당 유저를 찾을 수 없습니다.');
    }
    const result = await this.pointRepository.caculatePoint(userId, point, status, adjustment);
    return result;
  };
  showUserPoint = async (userId) => {
    const point = await this.pointRepository.searchPoint(userId);
    return point;
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
