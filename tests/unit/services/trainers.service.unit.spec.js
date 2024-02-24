import { TrainerService } from '../../../src/services/trainers.service.js';
import { beforeEach, describe, expect, jest } from '@jest/globals';
import CustomError from '../../../src/utils/errorHandler';

const mockTrainerRepository = {
  findUserByEmail: jest.fn(),
  findUserByPhoneNumber: jest.fn(),
  signUpWithEmail: jest.fn(),
};
const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn(),
};

const trainerService = new TrainerService(mockTrainerRepository);

describe('Trainer Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
});
