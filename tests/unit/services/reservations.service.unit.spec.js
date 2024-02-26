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
});
