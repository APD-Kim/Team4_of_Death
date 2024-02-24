import { TrainerService } from '../../../src/services/trainers.service.js';
import { beforeEach, describe, expect, jest } from '@jest/globals';
import CustomError from '../../../src/utils/errorHandler';

const mockTrainerRepository = {
  registerTrainer: jest.fn(),
  findAllTrainer: jest.fn(),
  findOneTrainer: jest.fn(),
  findTrainerByCategory: jest.fn(),
};

const trainerService = new TrainerService(mockTrainerRepository);

describe('Trainer Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
});
