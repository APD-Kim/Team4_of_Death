import { expect, jest } from '@jest/globals';
import { ReservationRepository } from '../../../src/repositories/reservations.repository.js';

const mockPrisma = {
  reservations: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
};

let reservationRepository = new ReservationRepository(mockPrisma);

describe('Reservation Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('findPossibleDates Method Success', async () => {
    // mock된 Prisma함수가 반환할 가짜 정보를 정의
    const mockReturn = 'findPossibleDates Return string';
    mockPrisma.reservations.findMany.mockReturnValue(mockReturn);

    const reservations = await reservationRepository.findPossibleDates(1);

    expect(mockPrisma.reservations.findMany).toHaveBeenCalledTimes(1);
    expect(reservations).toBe(mockReturn);
  });
  test('reserveDate Method ', async () => {
    const mockReturn = 'create Return string';
    mockPrisma.reservations.create.mockReturnValue(mockReturn);

    const reservations = await reservationRepository.reserveDate(1);

    expect(mockPrisma.reservations.create).toHaveBeenCalledTimes(1);
    expect(reservations).toBe(mockReturn);
  });
});
