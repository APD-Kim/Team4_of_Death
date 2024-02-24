import { expect, jest } from '@jest/globals';
import CustomError from '../../../src/utils/errorHandler.js';
import { TrainerController } from '../../../src/controllers/trainers.controller.js';

const mockTrainerService = {
  validatePhoneNumber: jest.fn(),
  signUp: jest.fn(),
  validUser: jest.fn(),
  signToken: jest.fn(),
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
});
