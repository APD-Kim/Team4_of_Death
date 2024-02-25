import { beforeAll, beforeEach, describe, expect, jest } from '@jest/globals';
import { ReservationService } from '../../../src/services/reservations.service';
import CustomError from '../../../src/utils/errorHandler.js';

const mockReservationRepository = {
  findPossibleDates: jest.fn(),
  findReservationById: jest.fn(),
  updateReservation: jest.fn(),
  deleteReservation: jest.fn(),
};

const reservationService = new ReservationService(mockReservationRepository);

describe('Reservation Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('findPossibleDates Method Success', async () => {
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

    mockReservationRepository.findPossibleDates.mockReturnValue(mockPossibleDates);
    const possibleDates = await reservationService.findPossibleDates(1);
    const compareDates = [{
      reservationId: 1,
      startDate: '2024-02-26',
      endDate: '2024-02-27',
      petCategory: 'dog',
    }];

    expect(compareDates).toEqual(possibleDates);
    expect(mockReservationRepository.findPossibleDates).toHaveBeenCalledTimes(1);
    expect(mockReservationRepository.findPossibleDates).toHaveBeenCalledWith(1);
  });
});
