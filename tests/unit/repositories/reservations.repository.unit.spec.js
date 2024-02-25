import { expect, jest } from '@jest/globals';
import { ReservationRepository } from '../../../src/repositories/reservations.repository.js';

let mockPrisma = {
  reservations: {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

let reservationRepository = new ReservationRepository(mockPrisma);

describe('Reservation Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('findPossibleDates Method Success', async () => {
    const mockReturn = 'findPossibleDates Return string';
    mockPrisma.reservations.findMany.mockReturnValue(mockReturn);

    const reservations = await reservationRepository.findPossibleDates(1);

    expect(mockPrisma.reservations.findMany).toHaveBeenCalledTimes(1);
    expect(reservations).toBe(mockReturn);
  });

  test('findReservationById Method Success', async () => {
    const mockReturn = 'reservationId Return string';
    const findReservationId = {
      reservationId: 1,
    };
    mockPrisma.reservations.findFirst.mockReturnValue(mockReturn);
    const findData = await reservationRepository.findReservationById(findReservationId.reservationId);
    expect(findData).toEqual(mockReturn);
    expect(mockPrisma.reservations.findFirst).toHaveBeenCalledTimes(1);
    expect(mockPrisma.reservations.findFirst).toHaveBeenCalledWith({
      where: {
        reservationId: findReservationId.reservationId,
      },
    });
  });
});
