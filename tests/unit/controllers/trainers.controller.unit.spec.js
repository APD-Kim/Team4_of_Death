import { expect, jest } from '@jest/globals';
import CustomError from '../../../src/utils/errorHandler.js';
import { TrainerController } from '../../../src/controllers/trainers.controller.js';

const mockTrainerService = {
  registerTrainer: jest.fn(),
  findAllTrainer: jest.fn(),
  findOneTrainer: jest.fn(),
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

const trainerController = new TrainerController(mockTrainerService);

describe('Trainer Controller Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status.mockReturnValue(mockResponse);
  });

  it('findTrainerByCategory Method Success', async () => {
    const mockReturn = 'findTrainerByCategory complete';
    mockRequest.params = { category: 'dog' };
    mockTrainerService.findTrainerByCategory.mockResolvedValue(mockReturn);
    await trainerController.findTrainerByCategory(mockRequest, mockResponse, mockReturn);
    expect(mockTrainerService.findTrainerByCategory).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: '카테고리별 펫시터 조회 완료', data: mockReturn });
  });
  it('findTrainerByCategory Method about null arguments', async () => {
    mockRequest.params = {};
    await trainerController.findTrainerByCategory(mockRequest, mockResponse, mockNext);
    expect(mockTrainerService.findTrainerByCategory).toHaveBeenCalledTimes(0);
    expect(mockNext).toHaveBeenCalledWith(new CustomError(400, 'category 값이 비어있습니다.'));
  });
  it('findTrainerByCategory Method about invalid arguments', async () => {
    mockRequest.params = { category: 'dogggg' };
    await trainerController.findTrainerByCategory(mockRequest, mockResponse, mockNext);
    expect(mockTrainerService.findTrainerByCategory).toHaveBeenCalledTimes(0);
    expect(mockNext).toHaveBeenCalledWith(new CustomError(400, 'category 가 올바르지 않습니다.'));
  });
});
