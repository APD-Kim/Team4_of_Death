import CustomError from "../utils/errorHandler.js";

export class PointService {
  constructor(pointRepository, userRepository) {
    this.pointRepository = pointRepository;
    this.userRepository = userRepository
  }

  caculateUserPoint = async (userId, point, status, adjustment) => {
    const findUser = await this.userRepository.findUserByUserId(userId)
    if (!findUser) {
      throw new CustomError(404, "해당 유저를 찾을 수 없습니다.")
    }
    const result = await this.pointRepository.caculatePoint(userId, point, status, adjustment)
    return result;
  }
  showUserPoint = async (userId) => {
    const point = await this.pointRepository.searchPoint(userId);
    return point;
  }

  showPointHistory = async (userId) => {
    const findUser = await this.userRepository.findUserByUserId(userId)
    const { pointId } = findUser.points
    const pointHistory = await this.pointRepository.searchPointHistory(pointId)
    return pointHistory.map((e) => {
      return {
        historyId: e.historyId,
        point: e.point,
        pointChanged: e.pointChanged,
        status: e.status,
        createdAt: e.createdAt
      }
    })
  }
}