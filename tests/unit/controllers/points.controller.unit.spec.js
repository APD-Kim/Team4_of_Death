import { expect, jest } from '@jest/globals';
import { PointController } from '../../../src/controllers/points.controller.js';
import CustomError from '../../../src/utils/errorHandler.js';

const mockPointService = {
  calculateUserPoint: jest.fn(),
  showUserPoint: jest.fn(),
  showPointHistory: jest.fn(),
};

const pointController = new PointController(mockPointService);

const mockRequest = {
  body: jest.fn(),
  params: jest.fn(),
  query: jest.fn(),
  user: jest.fn(),
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

const mockNext = jest.fn();

describe('Point Controller Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockResponse.status.mockReturnValue(mockResponse);
  });
  it('calculatePoint method test by Success with increment', async () => {
    const mockReturn = 'calculate complete';

    mockRequest.user = {
      userId: 2,
    };

    mockRequest.body = {
      point: 300,
      status: 'fill',
      adjustment: 'increment',
    };

    mockPointService.calculateUserPoint.mockResolvedValue(mockReturn);
    await pointController.calculatePoint(mockRequest, mockResponse, mockNext);
    expect(mockPointService.calculateUserPoint).toHaveBeenCalledTimes(1);
    expect(mockPointService.calculateUserPoint).toHaveBeenCalledWith(2, 300, 'FILL', 'increment');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '포인트가 충전되었습니다.',
      data: mockReturn,
    });
  });
  it('calculatePoint method test by Success with decrement', async () => {
    const mockReturn = 'calculate complete';

    mockRequest.user = {
      userId: 2,
    };

    mockRequest.body = {
      point: 300,
      status: 'reserve',
      adjustment: 'decrement',
    };

    mockPointService.calculateUserPoint.mockResolvedValue(mockReturn);
    await pointController.calculatePoint(mockRequest, mockResponse, mockNext);
    expect(mockPointService.calculateUserPoint).toHaveBeenCalledTimes(1);
    expect(mockPointService.calculateUserPoint).toHaveBeenCalledWith(2, 300, 'RESERVE', 'decrement');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '포인트가 차감되었습니다.',
      data: mockReturn,
    });
  });
  it('calculatePoint method test by Failed invalid status', async () => {
    mockRequest.user = {
      userId: 2,
    };

    mockRequest.body = {
      point: 300,
      status: 'sadPog',
      adjustment: 'decrement',
    };
    await pointController.calculatePoint(mockRequest, mockResponse, mockNext);
    expect(mockPointService.calculateUserPoint).toHaveBeenCalledTimes(0);
    expect(mockNext).toHaveBeenCalledWith(new CustomError(400, '적절하지 않은 형식입니다.'));
  });
  it('calculatePoint method test by Failed invalid adjustment', async () => {
    mockRequest.user = {
      userId: 2,
    };

    mockRequest.body = {
      point: 300,
      status: 'refund',
      adjustment: 'sparta',
    };
    await pointController.calculatePoint(mockRequest, mockResponse, mockNext);
    expect(mockPointService.calculateUserPoint).toHaveBeenCalledTimes(0);
    expect(mockNext).toHaveBeenCalledWith(new CustomError(400, '적절하지 않은 형식입니다.'));
  });
  it('showUserPoint method test by Success', async () => {
    const mockReturn = 'user Point Result';
    mockRequest.user = {
      userId: 1,
    };
    mockPointService.showUserPoint.mockResolvedValue(mockReturn);
    await pointController.showUserPoint(mockRequest, mockResponse, mockNext);
    expect(mockPointService.showUserPoint).toHaveBeenCalledTimes(1);
    expect(mockPointService.showUserPoint).toHaveBeenCalledWith(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: '현재 남은 포인트입니다.',
      data: mockReturn,
    });
  });
  it('showPointHistory method by success without orderBy value', async () => {
    const mockReturn = 'point history result';

    mockRequest.user = {
      userId: 1,
    };
    mockPointService.showPointHistory.mockResolvedValue(mockReturn);
    await pointController.showPointHistory(mockRequest, mockResponse, mockNext);
    expect(mockPointService.showPointHistory).toHaveBeenCalledTimes(1);
    expect(mockPointService.showPointHistory).toHaveBeenCalledWith(1, 'desc');
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: mockReturn,
    });
  });
});
