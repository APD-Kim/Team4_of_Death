import { expect, jest } from '@jest/globals';
import CustomError from '../../../src/utils/errorHandler.js';
import { TrainerController } from '../../../src/controllers/trainers.controller.js';

const mockTrainerService = {
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

  it('registerTrainer Success', async () => {
    const mockReturn = 'registerTrainer';

    mockRequest.body = {
      userId: 1,
      price: 3000,
      career: 1,
      petCategory: 'dog',
      address: '서울시 어쩌숙',
    };

    mockTrainerService.registerTrainer.mockResolvedValue(mockReturn);
    await trainerController.registerTrainer(mockRequest, mockResponse, mockNext);
    expect(mockTrainerService.registerTrainer).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(202);
  });

  it('findAllTrainer Success', async () => {
    const mockReturn = 'findAllTrainer';

    mockTrainerService.findAllTrainer.mockResolvedValue(mockReturn);
    await trainerController.findAllTrainer(mockRequest, mockResponse, mockNext);
    expect(mockTrainerService.findAllTrainer).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(202);
  });

  it('findOneTrainer Success', async () => {
    const mockReturn = 'findOneTrainer';

    mockRequest.params = {
      trainerId: 3,
    };

    mockTrainerService.findOneTrainer.mockResolvedValue(mockReturn);
    await trainerController.findOneTrainer(mockRequest, mockResponse, mockNext);
    expect(mockTrainerService.findOneTrainer).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it('updateTrainer Success', async () => {
    const mockReturn = 'updateTrainer';

    mockRequest.params = {
      trainerId: 3,
    };

    mockTrainerService.updateTrainer.mockResolvedValue(mockReturn);
    await trainerController.updateTrainer(mockRequest, mockResponse, mockNext);
    expect(mockTrainerService.updateTrainer).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });

  it('deleteTrainer Success', async () => {
    const mockReturn = 'deleteTrainer';

    mockRequest.params = {
      trainerId: 3,
    };

    mockTrainerService.deleteTrainer.mockResolvedValue(mockReturn);
    await trainerController.deleteTrainer(mockRequest, mockResponse, mockNext);
    expect(mockTrainerService.deleteTrainer).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
  });
});
