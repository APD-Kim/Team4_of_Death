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
  existLike: jest.fn(),
  likeTrainer: jest.fn(),
  cancelLikeTrainer: jest.fn(),
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
    mockTrainerRepository.findTrainerByCategory.mockResolvedValue(mockReturn);
    const trainerList = await trainerService.findTrainerByCategory('dog');
    expect(trainerList).toEqual(mockReturn);
    expect(mockTrainerRepository.findTrainerByCategory).toHaveBeenCalledTimes(1);
    expect(mockTrainerRepository.findTrainerByCategory).toHaveBeenCalledWith('dog');
  });
  it('findTrainerByCategory Method about null data', async () => {
    const mockReturn = null;
    try {
      mockTrainerRepository.findTrainerByCategory.mockResolvedValue(mockReturn);
      const trainerList = await trainerService.findTrainerByCategory('dog');
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

  // it('registerTrainer ERR', async () => {
  //   const registerTrainer = null;
  //   try {
  //     mockTrainerRepository.findOneUser.mockResolvedValue(mockReturn);
  //   } catch (err) {
  //     expect(err).toBeInstanceOf(CustomError);
  //     expect(err.statusCode).toEqual(400);
  //     expect(err.message).toEqual('이미 트레이너로 등록된 사용자 입니다.');
  //   }
  //   try {
  //     mockTrainerRepository.registerTrainer.mockResolvedValue(1);
  //   } catch (err) {
  //     expect(err).toBeInstanceOf(CustomError);
  //     expect(err.statusCode).toEqual(400);
  //     expect(err.message).toEqual('트레이너 등록을 위한 필수 정보가 누락되었습니다.');
  //   }
  // });

  it('findAllTrainer Success', async () => {
    const mockReturn = 'findAllTrainer';

    mockTrainerRepository.findAllTrainer.mockResolvedValue(mockReturn);
    const findAllTrainerData = await trainerService.findAllTrainer();
    expect(findAllTrainerData).toEqual(mockReturn);
    expect(mockTrainerRepository.findAllTrainer).toHaveBeenCalledTimes(1);
  });

  it('findOneTrainer Success', async () => {
    const mockReturn = 'findOneTrainer';

    mockTrainerRepository.findOneTrainer.mockResolvedValue(mockReturn);
    const findOneTrainerData = await trainerService.findOneTrainer();
    expect(findOneTrainerData).toEqual(mockReturn);
    expect(mockTrainerRepository.findOneTrainer).toHaveBeenCalledTimes(1);
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
  it('likesTrainer  Success if did not like to trainer yet', async () => {
    const mockReturn = 'like Completed';
    const mockParams = {
      userId: 1,
      trainerId: 3,
    };
    const returnValue = {
      status: 'liked',
    };
    mockTrainerRepository.existLike.mockResolvedValue(null);
    mockTrainerRepository.likeTrainer.mockResolvedValue(mockReturn);
    const likedData = await trainerService.likeTrainer(mockParams.userId, mockParams.trainerId);
    expect(likedData).toEqual(returnValue);
    expect(mockTrainerRepository.existLike).toHaveBeenCalledTimes(1);
    expect(mockTrainerRepository.existLike).toHaveBeenCalledWith(mockParams.userId, mockParams.trainerId);
    expect(mockTrainerRepository.likeTrainer).toHaveBeenCalledTimes(1);
    expect(mockTrainerRepository.likeTrainer).toHaveBeenCalledWith(mockParams.userId, mockParams.trainerId);
  });
  it('likesTrainer  Success if already liked trainer', async () => {
    const mockReturn = 'cancel like Completed';
    const mockFindLikeValue = 'searched Liked Data';
    const mockParams = {
      userId: 1,
      trainerId: 3,
    };
    const returnValue = {
      status: 'cancelLiked',
    };
    mockTrainerRepository.existLike.mockResolvedValue(mockFindLikeValue);
    mockTrainerRepository.cancelLikeTrainer.mockResolvedValue(mockReturn);
    const likedData = await trainerService.likeTrainer(mockParams.userId, mockParams.trainerId);
    expect(likedData).toEqual(returnValue);
    expect(mockTrainerRepository.existLike).toHaveBeenCalledTimes(1);
    expect(mockTrainerRepository.existLike).toHaveBeenCalledWith(mockParams.userId, mockParams.trainerId);
    expect(mockTrainerRepository.cancelLikeTrainer).toHaveBeenCalledTimes(1);
    expect(mockTrainerRepository.cancelLikeTrainer).toHaveBeenCalledWith(mockParams.userId, mockParams.trainerId);
  });
  it('likesTrainer failed by database error', async () => {
    const mockReturn = null;
    const mockParams = {
      userId: 1,
      trainerId: 3,
    };
    const returnValue = {
      status: 'cancelLiked',
    };
    try {
      mockTrainerRepository.existLike.mockResolvedValue(null);
      mockTrainerRepository.likeTrainer.mockResolvedValue(mockReturn);
      const likedData = await trainerService.likeTrainer(mockParams.userId, mockParams.trainerId);
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('좋아요 생성중 오류가 발생했습니다.');
      expect(err.statusCode).toEqual(500);
    }
    expect(mockTrainerRepository.existLike).toHaveBeenCalledTimes(1);
    expect(mockTrainerRepository.existLike).toHaveBeenCalledWith(mockParams.userId, mockParams.trainerId);
    expect(mockTrainerRepository.likeTrainer).toHaveBeenCalledTimes(1);
    expect(mockTrainerRepository.likeTrainer).toHaveBeenCalledWith(mockParams.userId, mockParams.trainerId);
  });
});
