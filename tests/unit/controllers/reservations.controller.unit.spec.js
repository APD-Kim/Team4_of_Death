import { ReservationController } from '../../../src/controllers/reservations.controller';
import CustomError from '../../../src/utils/errorHandler';
import { beforeEach, describe, expect, jest } from '@jest/globals';

const mockReservationService = {
  findPossibleDates: jest.fn(),
  findReservationById: jest.fn(),
  updateReservation: jest.fn(),
  delReservation: jest.fn(),
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

  test('getDates method test', async () => {
    const mockReturn = ['2024-02-22', '2024-02-25'];
    mockReq.body = {
      trainerId: 3,
    };

    mockReservationService.findPossibleDates.mockResolvedValue(mockReturn);

    await reservationController.getDates(mockReq, mockRes, mockNext);

    expect(mockReservationService.findPossibleDates).toHaveBeenCalledWith(3);
    expect(mockReservationService.findPossibleDates).toHaveBeenCalledTimes(1);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ data: mockReturn });
  });

  test('putReservation Unit Test', async () => {
    const mockUpdatedReservation = {
      reservationId: 3,
      startDate: '2024-02-22',
      endDate: '2024-02-25',
    };

    mockReq.params.reservationId = 3;
    mockReq.body = {
      startDate: '2024-02-22',
      endDate: '2024-02-25',
    };

    mockReservationService.updateReservation.mockResolvedValue(mockUpdatedReservation);

    await reservationController.putReservation(mockReq, mockRes, mockNext);

    expect(mockReservationService.updateReservation).toHaveBeenCalledWith(
      3,
      mockReq.body.startDate,
      mockReq.body.endDate
    );

    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: '예약 날짜가 수정되었습니다.',
      data: mockUpdatedReservation,
    });
  });

  test('delReservation Unit Test', async () => {
    const mockReservationId = 3;

    mockReq.params.reservationId = mockReservationId;
    mockReservationService.findReservationById.mockResolvedValue();

    await reservationController.delReservation(mockReq, mockRes, mockNext);

    expect(mockReservationService.findReservationById).toHaveBeenCalledWith(mockReservationId);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ message: '삭제 완료되었습니다.' });
  });
});
