import { TrainerService } from '../../../src/services/trainers.service.js';
import { beforeEach, describe, expect, jest } from '@jest/globals';
import CustomError from '../../../src/utils/errorHandler.js';

const mockTrainerRepository = {
  registerTrainer: jest.fn(),
  findAllTrainer: jest.fn(),
  findOneTrainer: jest.fn(),
  updateTrainer: jest.fn(),
  deleteTrainer: jest.fn(),
  findTrainerByCategory: jest.fn(),
};

const mockRequest = {
  body: jest.fn(),
  params: jest.fn(),
  user: jest.fn(),
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  cookie: jest.fn(),
};

const mockNext = jest.fn();

const trainerService = new TrainerService(mockTrainerRepository);

describe('Trainer Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status.mockReturnValue(mockResponse);
  });

  it('findTrainerByCategory Method Success', async () => {
    const mockReturn = 'findTrainerByCategory complete';
    mockRequest.body = { category: 'dog' };
    mockTrainerRepository.findTrainerByCategory.mockResolvedValue(mockReturn);
    const trainerList = await trainerService.findTrainerByCategory(mockRequest, mockResponse, mockReturn);
    expect(trainerList).toEqual(mockReturn);
    expect(mockTrainerRepository.findTrainerByCategory).toHaveBeenCalledTimes(1);
    expect(mockTrainerRepository.findTrainerByCategory).toHaveBeenCalledWith(mockRequest);
  });
  it('findTrainerByCategory Method about null data', async () => {
    const mockReturn = null;
    mockRequest.body = { category: 'dog' };

    try {
      mockTrainerRepository.findTrainerByCategory.mockResolvedValue(mockReturn);
      const trainerList = await trainerService.findTrainerByCategory(mockRequest, mockResponse, mockNext);
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('해당 카테고리내 트레이너가 존재하지 않습니다.');
      expect(err.statusCode).toEqual(400);
    }
  });
});
