import { beforeEach, describe, expect, jest } from '@jest/globals';
import { TrainerRepository } from '../../../src/repositories/trainers.repository.js';

const mockPrisma = {
  users: {
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
});
