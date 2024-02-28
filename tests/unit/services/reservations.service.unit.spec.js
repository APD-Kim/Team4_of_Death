import { beforeAll, beforeEach, describe, expect, jest } from '@jest/globals';
import { ReservationService } from '../../../src/services/reservations.service';
import CustomError from '../../../src/utils/errorHandler.js';
import { ReservationRepository } from '../../../src/repositories/reservations.repository.js';

const mockReservationRepository = {
  findPossibleDates: jest.fn(),
  findReservationById: jest.fn(),
  findReservationByIdUnique: jest.fn(),
  updateReservation: jest.fn(),
  update: jest.fn(),
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
    const compareDates = [
      {
        reservationId: 1,
        startDate: '2024-02-26',
        endDate: '2024-02-27',
        petCategory: 'dog',
      },
    ];

    expect(compareDates).toEqual(possibleDates);
    expect(mockReservationRepository.findPossibleDates).toHaveBeenCalledTimes(1);
    expect(mockReservationRepository.findPossibleDates).toHaveBeenCalledWith(1);
  });
  test('findReservationById Method Success', async () => {
    const compareReservationId = 1;

    mockReservationRepository.findReservationById.mockReturnValue(compareReservationId);
    const reservations = await reservationService.findReservationById(compareReservationId);
    expect(mockReservationRepository.findReservationById).toHaveBeenCalledTimes(1);
    expect(mockReservationRepository.findReservationById).toHaveBeenCalledWith(compareReservationId);
    expect(reservations).toEqual(compareReservationId);
  });

  test('findReservationById Unique Unit Test', async () => {
    const mockReservation = {
      userId: 1,
    };
    // 현재 1이 들어와있는 상태니까 내가 2를 던져주면 오류를 뱉는지 실험을 하면 되겠지
    mockReservationRepository.findReservationByIdUnique.mockReturnValue(mockReservation);
    const compareDatas = {
      userId: 2,
      reservationId: 1,
      startDate: '2024-02-26',
      endDate: '2024-02-27',
    };
    await expect(
      reservationService.updateReservation(
        compareDatas.userId,
        compareDatas.reservationId,
        compareDatas.startDate,
        compareDatas.endDate
      )
    ).rejects.toThrow('해당 예약에 권한이 없습니다.');
  });

  test('Update Reservation Method Test', async () => {
    const mockReservation = {
      userId: 1,
    };
    // 현재 1이 들어와있는 상태니까 내가 2를 던져주면 오류를 뱉는지 실험을 하면 되겠지
    mockReservationRepository.findReservationByIdUnique.mockReturnValue(mockReservation);

    const mockUpdateReservaion = {
      reservationId: 1,
      startDate: '2024-02-26',
      endDate: '2024-02-27',
    };
    // 가짜 비동기 만들기 그럼 여기엔 가짜로 만든 등록값이 저장되는거고
    mockReservationRepository.update.mockResolvedValue(mockUpdateReservaion);

    const compareData = await reservationService.updateReservation(1, 1, '2024-02-26', '2024-02-27');
    expect(mockReservationRepository.findReservationByIdUnique).toHaveBeenCalledTimes(1);
    expect(mockReservationRepository.update).toHaveBeenCalledTimes(1);
    expect(compareData).toEqual(mockUpdateReservaion);
    // 업데이트를 등록 했을때 반환되는 값이 일치하는지를 확인하는건가??????????????
  });

  test('Delete Reservation Unit Test', async () => {
    const reservationId = 1;
    const userId = 1;
    mockReservationRepository.deleteReservation.mockResolvedValue();

    const deletedReservation = await reservationService.deleteReservation(reservationId, userId);
    expect(deletedReservation).toEqual({ message: '예약 정보를 삭제하였습니다.' });
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
      console.log(err.stack);
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
