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
    const params = {
      userId: 1,
      point: 3000,
      status: 'FILL',
      adjustment: 'increment',
    };
    const resultValue = {
      updatedResultPoint: {
        point: 300,
        pointId: 1,
        createdAt: 'now',
      },
      createdHistory: {
        status: 'FILL',
        pointChanged: 500,
        createdAt: 'now',
      },
    };
    const returnValue = {
      point: 300,
      status: 'FILL',
      pointChanged: 500,
      createdAt: 'now',
    };
    mockPointRepository.calculatePoint.mockResolvedValue(resultValue);
    const result = await pointService.calculateUserPoint(params.userId, params.point, params.status, params.adjustment);
    expect(result).toEqual(returnValue);
    expect(mockPointRepository.calculatePoint).toHaveBeenCalledTimes(1);
    expect(mockPointRepository.calculatePoint).toHaveBeenCalledWith(
      params.userId,
      params.point,
      params.status,
      params.adjustment
    );
  });
  test('showUserPoint method by success', async () => {
    const params = {
      userId: 1,
    };
    const returnValue = {
      point: 300,
      updatedAt: 'updated',
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
