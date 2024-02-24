import { jest } from '@jest/globals';
import { ReservationRepository } from '../../../src/repositories/reservations.repository.js';

let mockPrisma = {
  reservations: {
    findMany: jest.fn()
  },
};

let reservationRepository = new ReservationRepository(mockPrisma);

describe('Reservation Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('findPossibleDates Method ', async () => {
    const mockReturn = 'create Return string';
    mockPrisma.reservations.findMany.mockReturnValue(mockReturn);

    const reservations = await reservationRepository.findPossibleDates(1);
    
    expect(mockPrisma.reservations.findMany).toHaveBeenCalledTimes(1);
    expect(reservations).toBe(mockReturn);
  });
});
