import { expect, jest } from '@jest/globals';
import { PointRepository } from '../../../src/repositories/points.repository';

const mockPrisma = {
  $transaction: jest.fn(),
  _calculatePoint: jest.fn(),
  _addHistory: jest.fn(),
};
