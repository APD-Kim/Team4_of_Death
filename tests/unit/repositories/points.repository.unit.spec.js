import { expect, jest } from '@jest/globals';
import { PointRepository } from '../../../src/repositories/points.repository';

const mockPrisma = {
  $transaction: jest.fn(),
  points: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
  pointHistory: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

const pointRepository = new PointRepository(mockPrisma);

describe('Reservation Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('calculatePoint method by success', async () => {
    const mockParams = {
      userId: '1',
      point: 300,
      status: 'FILL',
      adjustment: 'increment',
    };
    const mockUserCreationResult = { historyId: 1, userId: 1, email: 'popcon94062011@gmail.com' };
    const mockPointCreationResult = { pointId: 'some-random-id', userId: 1, point: 1000 };
    mockPrisma.points.update.mockResolvedValue(mockPointCreationResult);
    mockPrisma.pointHistory.create.mockResolvedValue(mockUserCreationResult);
    mockPrisma.$transaction.mockImplementation((cb) => cb(mockPrisma));
    const result = await pointRepository.calculatePoint(
      mockParams.userId,
      mockParams.point,
      mockParams.status,
      mockParams.adjustment
    );
    expect(result).toEqual({ updatedResultPoint: mockPointCreationResult, createdHistory: mockUserCreationResult });
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
  });
  it('searchPoint method by success', async () => {
    const mockReturn = 'searched point';
    const params = {
      userId: 1,
    };
    mockPrisma.points.findFirst.mockResolvedValue(mockReturn);
    const result = await pointRepository.searchPoint(params.userId);
    expect(mockPrisma.points.findFirst).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockReturn);
  });
  it('searchPointHistory method by success', async () => {
    const mockReturn = 'searched history list';
    const params = {
      pointId: 1,
      orderBy: 'desc',
    };
    mockPrisma.pointHistory.findMany.mockResolvedValue(mockReturn);
    const result = await pointRepository.searchPointHistory(params.pointId, params.orderBy);
    expect(mockPrisma.pointHistory.findMany).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockReturn);
  });
  it('_calculatePoint method by success about increment', async () => {
    const mockReturn = 'calculated point value';
    const params = {
      userId: 1,
      point: 300,
      adjustment: 'increment',
    };
    mockPrisma.points.update.mockResolvedValue(mockReturn);
    const result = await pointRepository._calculatePoint(params.userId, params.point, params.adjustment);
    expect(mockPrisma.points.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.points.update).toHaveBeenCalledWith({
      where: {
        userId: Number(params.userId),
      },
      data: {
        point: {
          increment: Number(params.point),
        },
      },
    });
    expect(result).toEqual(mockReturn);
  });
  it('_calculatePoint method by success about decrement', async () => {
    const mockReturn = 'calculated point value';
    const params = {
      userId: 1,
      point: 300,
      adjustment: 'decrement',
    };
    mockPrisma.points.update.mockResolvedValue(mockReturn);
    const result = await pointRepository._calculatePoint(params.userId, params.point, params.adjustment);
    expect(mockPrisma.points.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.points.update).toHaveBeenCalledWith({
      where: {
        userId: Number(params.userId),
      },
      data: {
        point: {
          decrement: Number(params.point),
        },
      },
    });
    expect(result).toEqual(mockReturn);
  });
  it('_addHistory method by success', async () => {
    const mockReturn = 'calculated point value';
    const params = {
      status: 'FILL',
      point: 300,
      resultedPoint: 3000,
      resultedPointId: 1,
    };
    mockPrisma.pointHistory.create.mockResolvedValue(mockReturn);
    const result = await pointRepository._addHistory(
      params.point,
      params.status,
      params.resultedPoint,
      params.resultedPointId
    );
    expect(mockPrisma.pointHistory.create).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockReturn);
  });
});
