import { ReservationController } from '../../../src/controllers/reservations.controller';
import { ReservationService } from '../../../src/services/reservations.service';
import CustomError from '../../../src/utils/errorHandler';
import { beforeEach, describe, expect, jest } from '@jest/globals';

const mockReservationService = {
  findReservationDates: jest.fn(),
  findReservationById: jest.fn(),
  updateReservation: jest.fn(),
  delReservation: jest.fn(),
  reserveDate: jest.fn(),
};

const reservationController = new ReservationController(mockReservationService);

const mockReq = {
  body: jest.fn(),
  params: jest.fn(),
  user: jest.fn(),
};

const mockRes = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
};

const mockNext = jest.fn();

describe('Reservation Controller Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockRes.status.mockReturnValue(mockRes);
  });
  test('reserveTrainer method by success', async () => {
    mockReq.user = {
      userId: 1,
    };
    mockReq.body = {
      trainerId: 1,
      startDate: '2024-02-22',
      endDate: '2024-02-25',
    };
    const mockReturn = 'complete String';
    mockReservationService.reserveDate.mockResolvedValue(mockReturn);
    await reservationController.reserveTrainer(mockReq, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '성공적으로 예약이 완료되었습니다.', data: mockReturn });
  });

  test('getDates method test', async () => {
    const mockReturn = ['2024-02-22', '2024-02-25'];
    mockReq.body = {
      trainerId: 3,
    };

    mockReservationService.findReservationDates.mockResolvedValue(mockReturn);

    await reservationController.getDates(mockReq, mockRes, mockNext);

    expect(mockReservationService.findReservationDates).toHaveBeenCalledWith(3);
    expect(mockReservationService.findReservationDates).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ data: mockReturn });
  });

  test('putReservation Method Test', async () => {
    const mockUpdatedReservation = {
      reservationId: 3,
      startDate: '2024-02-22',
      endDate: '2024-02-25',
    };
    console.log(mockUpdatedReservation);

    mockReq.params = {
      reservationId: 3,
    }
    mockReq.body = {
      startDate: '2024-02-22',
      endDate: '2024-02-25',
    };

    mockReservationService.updateReservation.mockResolvedValue(mockUpdatedReservation);

    await reservationController.putReservation(mockReq, mockRes, mockNext);

    expect(mockReservationService.updateReservation).toHaveBeenCalledWith(
      mockReq.params.reservationId,
      mockReq.body.startDate,
      mockReq.body.endDate,
    );

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: '예약 날짜가 수정되었습니다.',
      data: mockUpdatedReservation,
    });
  });

  test('delReservation Unit Test', async () => {
    const mockReservationId = 3;
    const mockDeleteReservation = {
      reservationId: 3,
    }
    mockReservationService.deleteReservation.mockResolvedValue(mockDeleteReservation);

    const deletedReservation = await reservationController.delReservation(mockReservationId);

    expect(mockReservationService.deleteReservation).toHaveBeenCalledWith(mockReservationId);
    expect(mockReservationService.deleteReservation).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '삭제 완료되었습니다.' });
    expect(deletedReservation).toEqual(mockDeleteReservation);
  });
});
