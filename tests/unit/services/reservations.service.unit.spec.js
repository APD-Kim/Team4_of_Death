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
  reserveDate: jest.fn(),
  isReservatedDate: jest.fn(),
};
const mockTrainerRepository = {
  findOneTrainer: jest.fn(),
};
const mockPointRepository = {
  searchPoint: jest.fn(),
  calculatePoint: jest.fn(),
};
const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

const reservationService = new ReservationService(
  mockReservationRepository,
  mockTrainerRepository,
  mockPointRepository
);

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
  test('reserveDate method by success', async () => {
    const params = {
      userId: 1,
      trainerId: 2,
      startDate: '2025-11-12',
      endDate: '2025-11-13',
    };
    const searchPointReturnValue = {
      point: 30000,
    };
    const findOneTrainerReturnValue = {
      price: 300,
    };

    const searchDatesReturnValue = [];
    const reservedDateReturnValue = {
      trainerId: 1,
      startDate: '2024-04-20T00:00:00.000Z',
      endDate: '2024-04-20T23:59:59.000Z',
      status: 'STANDBY',
      createdAt: '2024-02-28T08:24:37.596Z',
    };
    const subPointValue = {
      updatedResultPoint: {
        point: 5500,
      },
      createdHistory: {
        pointChanged: 300,
      },
    };
    const returnValue = {
      trainerId: 1,
      startDate: '2024-04-20T00:00:00.000Z',
      endDate: '2024-04-20T23:59:59.000Z',
      status: 'STANDBY',
      createdAt: '2024-02-28T08:24:37.596Z',
      currentPoint: 5500,
      totalPrice: 300,
    };
    mockPointRepository.searchPoint.mockResolvedValue(searchPointReturnValue);
    mockTrainerRepository.findOneTrainer.mockResolvedValue(findOneTrainerReturnValue);
    mockReservationRepository.isReservatedDate.mockResolvedValue(searchDatesReturnValue);
    mockReservationRepository.reserveDate.mockResolvedValue(reservedDateReturnValue);
    mockPointRepository.calculatePoint.mockResolvedValue(subPointValue);
    const result = await reservationService.reserveDate(
      params.userId,
      params.trainerId,
      params.startDate,
      params.endDate
    );
    expect(mockPointRepository.searchPoint).toHaveBeenCalledTimes(1);
    expect(mockPointRepository.searchPoint).toHaveBeenCalledWith(params.userId);
    expect(mockTrainerRepository.findOneTrainer).toHaveBeenCalledTimes(1);
    expect(mockTrainerRepository.findOneTrainer).toHaveBeenCalledWith(params.trainerId);
    expect(mockReservationRepository.isReservatedDate).toHaveBeenCalledTimes(1);
    expect(mockReservationRepository.isReservatedDate).toHaveBeenCalledWith(
      params.trainerId,
      params.startDate,
      params.endDate
    );
    expect(mockReservationRepository.reserveDate).toHaveBeenCalledTimes(1);
    expect(mockReservationRepository.reserveDate).toHaveBeenCalledWith(
      params.userId,
      params.trainerId,
      '2025-11-12T00:00:00Z',
      '2025-11-13T23:59:59Z'
    );
    expect(mockPointRepository.calculatePoint).toHaveBeenCalledTimes(1);
    expect(mockPointRepository.calculatePoint).toHaveBeenCalledWith(params.userId, 600, 'RESERVE', 'decrement');
    expect(result).toEqual(returnValue);
  });
  test('reserveDate method failed by invalid dates', async () => {
    const params = {
      userId: 1,
      trainerId: 2,
      startDate: '19971-1112',
      endDate: '1997-1113',
    };
    try {
      await reservationService.reserveDate(params.userId, params.trainerId, params.startDate, params.endDate);
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('날짜 형식이 잘못 됐습니다.');
      expect(err.statusCode).toEqual(400);
    }
  });
  test('reserveDate method failed by wrong startDate', async () => {
    const params = {
      userId: 1,
      trainerId: 2,
      startDate: '1997-11-14',
      endDate: '1997-11-13',
    };
    try {
      await reservationService.reserveDate(params.userId, params.trainerId, params.startDate, params.endDate);
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('시작 날짜는 반드시 종료 날짜보다 전이어야 합니다.');
      expect(err.statusCode).toEqual(400);
    }
  });
  test('reserveDate method failed by cannot found trainer', async () => {
    const params = {
      userId: 1,
      trainerId: 2,
      startDate: '2025-11-12',
      endDate: '2025-11-13',
    };
    try {
      mockPointRepository.searchPoint.mockResolvedValue({ point: 3000 });
      mockTrainerRepository.findOneTrainer.mockResolvedValue(null);
      await reservationService.reserveDate(params.userId, params.trainerId, params.startDate, params.endDate);
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('해당 트레이너를 찾을 수 없습니다.');
      expect(err.statusCode).toEqual(404);
    }
  });
  test('reserveDate method failed by exist reserved date', async () => {
    const params = {
      userId: 1,
      trainerId: 2,
      startDate: '2025-11-12',
      endDate: '2025-11-13',
    };
    try {
      mockPointRepository.searchPoint.mockResolvedValue({ point: 3000 });
      mockTrainerRepository.findOneTrainer.mockResolvedValue({ price: 300 });
      mockReservationRepository.isReservatedDate.mockResolvedValue(true);
      await reservationService.reserveDate(params.userId, params.trainerId, params.startDate, params.endDate);
    } catch (err) {
      expect(err.message).toEqual('이미 예약되어있습니다.');
      expect(err).toBeInstanceOf(CustomError);
      expect(err.statusCode).toEqual(409);
    }
  });
  test('reserveDate method failed by cannot reserve 7days over', async () => {
    const params = {
      userId: 1,
      trainerId: 2,
      startDate: '2025-11-12',
      endDate: '2025-11-30',
    };
    try {
      mockPointRepository.searchPoint.mockResolvedValue({ point: 3000 });
      mockTrainerRepository.findOneTrainer.mockResolvedValue({ price: 300 });
      mockReservationRepository.isReservatedDate.mockResolvedValue(false);
      await reservationService.reserveDate(params.userId, params.trainerId, params.startDate, params.endDate);
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('7일 이상 예약할 수 없습니다.');
      expect(err.statusCode).toEqual(400);
    }
  });
  test('reserveDate method failed by not enough point', async () => {
    const params = {
      userId: 1,
      trainerId: 2,
      startDate: '2025-11-12',
      endDate: '2025-11-15',
    };
    try {
      mockPointRepository.searchPoint.mockResolvedValue({ point: 0 });
      mockTrainerRepository.findOneTrainer.mockResolvedValue({ price: 300 });
      mockReservationRepository.isReservatedDate.mockResolvedValue(false);
      await reservationService.reserveDate(params.userId, params.trainerId, params.startDate, params.endDate);
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('포인트가 충분하지 않습니다.');
      expect(err.statusCode).toEqual(400);
    }
  });
});
