import { expect, jest } from '@jest/globals';
import { ReservationRepository } from '../../../src/repositories/reservations.repository.js';

const mockPrisma = {
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
    // mock된 Prisma함수가 반환할 가짜 정보를 정의
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

  test('fincReservationByIdUnique Method Success', async () => {
    const mockReturn = 'reservationId Return string';
    const findReservationId = {
      reservationId: 1,
    };
    mockPrisma.reservations.findUnique.mockReturnValue(mockReturn);
    const findData = await reservationRepository.findReservationByIdUnique(findReservationId.reservationId);
    expect(findData).toEqual(mockReturn);
    expect(mockPrisma.reservations.findUnique).toHaveBeenCalledTimes(1);
    expect(mockPrisma.reservations.findUnique).toHaveBeenCalledWith({
      where: {
        reservationId: findReservationId.reservationId,
      },
    });
  });

  test('updateReservaion Method Success', async () => {
    const mockReturn = 'updateReservation data Return string';
    const reservationId = 1;
    const startDate = '2024-02-26T16:49:51.038Z';
    const endDate = '2024-02-27T16:49:51.038Z';

    mockPrisma.reservations.update.mockReturnValue(mockReturn);
    const updatedReservation = await reservationRepository.updateReservation(reservationId, startDate, endDate);
    expect(updatedReservation).toEqual(mockReturn);
    expect(mockPrisma.reservations.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.reservations.update).toHaveBeenCalledWith({
      where: {
        reservationId: +reservationId,
      },
      data: {
        startDate,
        endDate,
      },
    });
  });

  test('deleteReservation Method Success', async () => {
    const mockReturn = 'reservationdId Return string';
    const reservationId = 1;
    mockPrisma.reservations.delete.mockReturnValue(mockReturn);
    const deleteReservation = await reservationRepository.deleteReservation(reservationId);
    expect(deleteReservation).toEqual(mockReturn);
    expect(mockPrisma.reservations.delete).toHaveBeenCalledTimes(1);
    expect(mockPrisma.reservations.delete).toHaveBeenCalledWith({
      where: {
        reservationId: +reservationId,
      },
    });
  });
});
