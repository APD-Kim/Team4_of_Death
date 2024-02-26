import { beforeEach, describe, expect, jest } from '@jest/globals';
import { TrainerRepository } from '../../../src/repositories/trainers.repository.js';

const mockPrisma = {
  trainers: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
};

const trainerRepository = new TrainerRepository(mockPrisma);

describe('Trainer Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('findTrainerByCategory Method Success', async () => {
    const mockReturn = 'findTrainerByCategory complete';
    const findParams = {
      petCategory: 'dog',
    };
    mockPrisma.trainers.findMany.mockResolvedValue(mockReturn);
    const trainerList = await trainerRepository.findTrainerByCategory(findParams.petCategory);
    expect(trainerList).toEqual(mockReturn);
    expect(mockPrisma.trainers.findMany).toHaveBeenCalledTimes(1);
    expect(trainerList).toBe(mockReturn);
  });
});
