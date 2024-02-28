import { expect, jest } from '@jest/globals';
import { ReservationRepository } from '../../../src/repositories/reservations.repository.js';

const mockPrisma = {
  reservations: {
    findMany: jest.fn(),
    create: jest.fn(),
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

  test('find Trainer Possible Reservations Method Success', async () => {
    // mock된 Prisma함수가 반환할 가짜 정보를 정의
    const mockReturn = 'findTrainerPossibleReservations Return string';
    mockPrisma.reservations.findMany.mockReturnValue(mockReturn);

    const reservations = await reservationRepository.findTrainerPossibleReservations(1);

    expect(mockPrisma.reservations.findMany).toHaveBeenCalledTimes(1);
    expect(reservations).toBe(mockReturn);
  });

  test('find Reservation By Id Method Success', async () => {
    // mock된 Prisma함수가 반환할 가짜 정보를 정의
    const mockReturn = 'findReservationById Return string';
    mockPrisma.reservations.findFirst.mockReturnValue(mockReturn);

    const reservations = await reservationRepository.findReservationById(1);

    expect(mockPrisma.reservations.findFirst).toHaveBeenCalledTimes(1);
    expect(reservations).toBe(mockReturn);
  });

  test('find Reservation By Id Unique Method Success', async () => {
    // mock된 Prisma함수가 반환할 가짜 정보를 정의
    const mockReturn = 'findReservationByIdUnique Return string';
    mockPrisma.reservations.findUnique.mockReturnValue(mockReturn);

    const reservations = await reservationRepository.findReservationByIdUnique(1);

    expect(mockPrisma.reservations.findUnique).toHaveBeenCalledTimes(1);
    expect(reservations).toBe(mockReturn);
  });
  
  test('reserveDate Method ', async () => {
    const mockReturn = 'create Return string';
    mockPrisma.reservations.create.mockReturnValue(mockReturn);

    const reservations = await reservationRepository.reserveDate(1);

    expect(mockPrisma.reservations.create).toHaveBeenCalledTimes(1);
    expect(reservations).toBe(mockReturn);
  });

  test('update Reservation Method Test', async () => {
    const mockReservationId = 1;
    const mockStartDate = '2024-03-03';
    const mockEndDate = '2024-03-04';

    const mockUpdatedReservation = {
      reservationId: mockReservationId,
      startDate: mockStartDate,
      endDate: mockEndDate,
    } 

    mockPrisma.reservations.update.mockResolvedValue(mockUpdatedReservation);
    const updatedReservation = await reservationRepository.updateReservation(mockReservationId, mockStartDate, mockEndDate);

    expect(mockPrisma.reservations.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.reservations.update).toHaveBeenCalledWith({
      where: {
        reservationId: 1,
      },
      data: {
        startDate:'2024-03-03',
        endDate: '2024-03-04',
      }
    })
    expect(updatedReservation).toEqual(mockUpdatedReservation);
  })

  test('delete Reservation Method Test', async () => {
    const mockReservationId = 1;

    const mockDeletedReservation = {
      reservationId: mockReservationId,
    } 

    mockPrisma.reservations.update.mockResolvedValue(mockDeletedReservation);
    const deleteReservation = await reservationRepository.deleteReservation(mockReservationId);

    expect(mockPrisma.reservations.delete).toHaveBeenCalledTimes(1);
    expect(mockPrisma.reservations.delete).toHaveBeenCalledWith({
      where: {
        reservationId: 1,
      },
    })
  })

});
