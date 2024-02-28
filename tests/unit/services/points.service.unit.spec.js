import { PointService } from '../../../src/services/points.service';
import { beforeEach, describe, expect, jest } from '@jest/globals';
import CustomError from '../../../src/utils/errorHandler.js';

const mockPointRepository = {
  calculatePoint: jest.fn(),
  searchPoint: jest.fn(),
  searchPointHistory: jest.fn(),
};

const mockUserRepository = {
  findUserByUserId: jest.fn(),
};

const pointService = new PointService(mockPointRepository, mockUserRepository);

describe('User Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('calculateUserPoint method by success', async () => {
    const returnValue = 'result return value string';
    const params = {
      userId: 1,
      point: 3000,
      status: 'FILL',
      adjustment: 'increment',
    };
    mockUserRepository.findUserByUserId.mockResolvedValue('found User');
    mockPointRepository.calculatePoint.mockResolvedValue(returnValue);
    const result = await pointService.calculateUserPoint(params.userId, params.point, params.status, params.adjustment);
    expect(result).toEqual(returnValue);
    expect(mockUserRepository.findUserByUserId).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findUserByUserId).toHaveBeenCalledWith(params.userId);
    expect(mockPointRepository.calculatePoint).toHaveBeenCalledTimes(1);
    expect(mockPointRepository.calculatePoint).toHaveBeenCalledWith(
      params.userId,
      params.point,
      params.status,
      params.adjustment
    );
  });
  test('showUserPoint method by success', async () => {
    const returnValue = 'searched point';
    const params = {
      userId: 1,
    };
    mockPointRepository.searchPoint.mockResolvedValue(returnValue);
    const result = await pointService.showUserPoint(params.userId);
    expect(mockPointRepository.searchPoint).toHaveBeenCalledTimes(1);
    expect(mockPointRepository.searchPoint).toHaveBeenCalledWith(params.userId);
    expect(result).toEqual(returnValue);
  });
  test('showPointHistory method by success', async () => {
    const returnValue = [
      {
        historyId: 'M-mlTymQ-WU2_aCnjg4ys',
        pointChanged: 600,
        point: 2400,
        status: 'RESERVE',
        createdAt: '2024-02-26T12:47:08.307Z',
      },
      {
        historyId: '6qSklbheyhJzVWUrQas_s',
        pointChanged: 3000,
        point: 3000,
        status: 'REFUND',
        createdAt: '2024-02-26T12:47:01.376Z',
      },
    ];
    const params = {
      userId: 1,
      orderBy: 'DESC',
    };
    mockUserRepository.findUserByUserId.mockResolvedValue({ points: { pointId: 3 } });
    mockPointRepository.searchPointHistory.mockResolvedValue(returnValue);
    const result = await pointService.showPointHistory(1, params.orderBy);
    expect(mockUserRepository.findUserByUserId).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findUserByUserId).toHaveBeenCalledWith(params.userId);
    expect(mockPointRepository.searchPointHistory).toHaveBeenCalledTimes(1);
    expect(mockPointRepository.searchPointHistory).toHaveBeenCalledWith(3, params.orderBy);
    expect(result).toEqual(returnValue);
  });
  test('calculateUserPoint method failed by cannot find user', async () => {
    const params = {
      userId: 1,
      point: 3000,
      status: 'FILL',
      adjustment: 'increment',
    };
    try {
      mockUserRepository.findUserByUserId.mockResolvedValue(null);
      const result = await pointService.calculateUserPoint(
        params.userId,
        params.point,
        params.status,
        params.adjustment
      );
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('해당 유저를 찾을 수 없습니다.');
      expect(err.statusCode).toEqual(404);
    }
    expect(mockUserRepository.findUserByUserId).toHaveBeenCalledTimes(1);
    expect(mockPointRepository.calculatePoint).toHaveBeenCalledTimes(0);
  });
  test('showPointHistory method failed by invalid orderBy value', async () => {
    const params = {
      userId: 1,
      orderBy: 'good',
    };
    try {
      const result = await pointService.showPointHistory(1, params.orderBy);
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('정확한 정렬 방식을 사용해주세요.');
      expect(err.statusCode).toEqual(400);
    }
  });
});
