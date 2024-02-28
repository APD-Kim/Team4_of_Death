import { TrainerService } from '../../../src/services/trainers.service.js';
import { beforeEach, describe, expect, jest } from '@jest/globals';
import CustomError from '../../../src/utils/errorHandler.js';

const mockTrainerRepository = {
  registerTrainer: jest.fn(),
  findAllTrainer: jest.fn(),
  findOneTrainer: jest.fn(),
  findOneUser: jest.fn(),
  updateTrainer: jest.fn(),
  deleteTrainer: jest.fn(),
  findTrainerByCategory: jest.fn(),
};

// const mockRequest = {
//   body: jest.fn(),
//   params: jest.fn(),
//   user: jest.fn(),
// };

// const mockResponse = {
//   status: jest.fn().mockReturnThis(),
//   json: jest.fn().mockReturnThis(),
//   cookie: jest.fn(),
// };

// const mockNext = jest.fn();

const trainerService = new TrainerService(mockTrainerRepository);

describe('Trainer Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    // mockResponse.status.mockReturnValue(mockResponse);
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

  it('registerTrainer Success', async () => {
    const mockReturn = { users: { isTrainer: false } };

    mockTrainerRepository.findOneUser.mockResolvedValue(mockReturn);
    mockTrainerRepository.registerTrainer.mockResolvedValue(1);
    const registerTrainerData = await trainerService.registerTrainer(1, 300, 2, 'dog', '서울시 어쩌구');
    expect(registerTrainerData).toEqual(1);
    expect(mockTrainerRepository.findOneUser).toHaveBeenCalledTimes(1);
    expect(mockTrainerRepository.registerTrainer).toHaveBeenCalledTimes(1);
  });

  it('registerTrainer user CustomError', async () => {
    const mockReturn = { users: { isTrainer: true } };

    try {
      mockTrainerRepository.findOneUser.mockResolvedValue(mockReturn);
      await trainerService.registerTrainer();
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('이미 트레이너로 등록된 사용자 입니다.');
      expect(err.statusCode).toEqual(400);
    }
    expect(mockTrainerRepository.findOneUser).toHaveBeenCalledTimes(1);
    expect(mockTrainerRepository.registerTrainer).toHaveBeenCalledTimes(0);
  });

  it('registerTrainer info CustomError', async () => {
    const mockReturn = { users: { isTrainer: false } };

    try {
      mockTrainerRepository.findOneUser.mockResolvedValue(mockReturn);
      await trainerService.registerTrainer();
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('트레이너 등록을 위한 필수 정보가 누락되었습니다.');
      expect(err.statusCode).toEqual(400);
    }
    expect(mockTrainerRepository.findOneUser).toHaveBeenCalledTimes(1);
    expect(mockTrainerRepository.registerTrainer).toHaveBeenCalledTimes(0);
  });

  it('findAllTrainer Success', async () => {
    const mockReturn = 'findAllTrainer';

    mockTrainerRepository.findAllTrainer.mockResolvedValue(mockReturn);
    const findAllTrainerData = await trainerService.findAllTrainer();
    expect(findAllTrainerData).toEqual(mockReturn);
    expect(mockTrainerRepository.findAllTrainer).toHaveBeenCalledTimes(1);
  });

  it('findAllTrainer CustomError', async () => {
    const mockReturn = { users: { isTrainer: false } };

    try {
      mockTrainerRepository.findAllTrainer.mockResolvedValue(mockReturn);
      await trainerService.findAllTrainer();
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('트레이너가 없습니다.');
      expect(err.statusCode).toEqual(400);
    }
    expect(mockTrainerRepository.findOneUser).toHaveBeenCalledTimes(0);
    expect(mockTrainerRepository.registerTrainer).toHaveBeenCalledTimes(0);
  });

  it('findOneTrainer Success', async () => {
    const mockReturn = 'findOneTrainer';

    mockTrainerRepository.findOneTrainer.mockResolvedValue(mockReturn);
    const findOneTrainerData = await trainerService.findOneTrainer();
    expect(findOneTrainerData).toEqual(mockReturn);
    expect(mockTrainerRepository.findOneTrainer).toHaveBeenCalledTimes(1);
  });

  it('findOneTrainer CustomError', async () => {
    const mockReturn = { trainerId: false };

    try {
      // mockTrainerRepository.findOneTrainer.mockResolvedValue(mockReturn);
      await trainerService.findOneTrainer();
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('트레이너가 존재하지 않습니다.');
      expect(err.statusCode).toEqual(404);
    }
    expect(mockTrainerRepository.findOneUser).toHaveBeenCalledTimes(0);
    expect(mockTrainerRepository.registerTrainer).toHaveBeenCalledTimes(0);
  });

  it('updateTrainer Success', async () => {
    const mockReturn = 'updateTrainer';

    mockTrainerRepository.updateTrainer.mockResolvedValue(mockReturn);
    const updateTrainerData = await trainerService.updateTrainer(1, 300, 2, 'dog', '서울시 어쩌구');
    expect(updateTrainerData).toEqual(mockReturn);
    expect(mockTrainerRepository.updateTrainer).toHaveBeenCalledTimes(1);
  });

  it('deleteTrainer Success', async () => {
    const mockReturn = 'deleteTrainer';

    mockTrainerRepository.deleteTrainer.mockResolvedValue(mockReturn);
    const deleteTrainerData = await trainerService.deleteTrainer();
    expect(deleteTrainerData).toEqual(mockReturn);
    expect(mockTrainerRepository.deleteTrainer).toHaveBeenCalledTimes(1);
  });
});
