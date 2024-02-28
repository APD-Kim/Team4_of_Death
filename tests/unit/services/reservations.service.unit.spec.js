import { beforeAll, beforeEach, describe, expect, jest } from '@jest/globals';
import { ReservationService } from '../../../src/services/reservations.service';
import CustomError from '../../../src/utils/errorHandler.js';
import { ReservationRepository } from '../../../src/repositories/reservations.repository.js';

const mockTrainerRepository = {
  findOneTrainer: jest.fn(),
}

const mockReservationRepository = {
  findPossibleDatesForTrainer: jest.fn(), 
  findReservationDates: jest.fn(),
  findReservationById: jest.fn(),
  findReservationByIdUnique: jest.fn(),
  updateReservation: jest.fn(),
  deleteReservation: jest.fn(),
};
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

const reservationService = new ReservationService(mockReservationRepository);

describe('Reservation Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockRes.status.mockReturnValue(mockRes);
  });

  test('find Possible Dates For Trainer Method Test', async () => {
    const mockTrainerId = 1;

    mockTrainerRepository.find
  })

  test('findReservationDates Method Success', async () => {
    const mockPossibleDates = [
      {
        reservationId: 1,
        startDate: '2024-02-26',
        endDate: '2024-02-27',
        trainers: {
          petCategory: 'dog',
        },
      },
    ];

    mockReservationRepository.findReservationDates.mockReturnValue(mockPossibleDates);
    const possibleDates = await reservationService.findReservationDates(1);
    const compareDates = [
      {
        reservationId: 1,
        startDate: '2024-02-26',
        endDate: '2024-02-27',
        petCategory: 'dog',
      },
    ];

    expect(compareDates).toEqual(possibleDates);
    expect(mockReservationRepository.findReservationDates).toHaveBeenCalledTimes(1);
    expect(mockReservationRepository.findReservationDates).toHaveBeenCalledWith(1);
  });

  test('findReservationById Method Success', async () => {
    const compareReservationId = 1;

    mockReservationRepository.findReservationById.mockReturnValue(compareReservationId);
    const reservations = await reservationService.findReservationById(compareReservationId);
    expect(mockReservationRepository.findReservationById).toHaveBeenCalledTimes(1);
    expect(mockReservationRepository.findReservationById).toHaveBeenCalledWith(compareReservationId);
    expect(reservations).toEqual(compareReservationId);
  });

  test('find Reservation By Id Unique Test', async () => {
    const mockReservationId = 1;

    const mockReservationData = {
      reservationId: mockReservationId,
    }

    mockReservationRepository.findReservationByIdUnique.mockResolvedValue(mockReservationData);

    const result = await reservationService.findReservationByIdUnique(mockReservationId);
    expect(result.reservationId).toBe(mockReservationId);
    expect(mockReservationRepository.findReservationByIdUnique).toHaveBeenCalledTimes(1);
    expect(mockReservationRepository.findReservationByIdUnique).toHaveBeenCalledWith(mockReservationId);
  });

  test('Update Reservation Method Test', async () => {
    const mockReservation = {
      reservationId: 1,
      startDate: '2024-03-04',
      endDate: '2024-03-05',
    };
    mockReservationRepository.updateReservation.mockResolvedValue(mockReservation);

    const mockUpdateReservaion = {
      reservationId: 1,
      startDate: '2024-03-26',
      endDate: '2024-03-27',
    };
    mockReservationRepository.updateReservation.mockResolvedValue(mockUpdateReservaion);

    const compareData = await reservationService.updateReservation(1, 1, '2024-03-26', '2024-03-27');
    expect(mockReservationRepository.updateReservation).toHaveBeenCalledTimes(1);
    expect(mockReservationRepository.updateReservation).toHaveBeenCalledTimes(1);
    expect(compareData).toEqual(mockUpdateReservaion);
  });

  test('Delete Reservation Method Test', async () => {
    const reservationId = 1;
    mockReservationRepository.deleteReservation.mockResolvedValue(reservationId);

    const deletedReservation = await reservationService.deleteReservation(reservationId);
    expect(deletedReservation).toBe(reservationId);
    expect(mockReservationRepository.deleteReservation).toHaveBeenCalledWith(reservationId);
    expect(mockReservationRepository.deleteReservation).toHaveBeenCalledTimes(1);
  });
});
