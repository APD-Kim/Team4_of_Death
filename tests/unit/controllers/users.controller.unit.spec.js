import { expect, jest } from '@jest/globals';
import { UserController } from '../../../src/controllers/users.controller.js';
import CustomError from '../../../src/utils/errorHandler.js';

const mockUserService = {
  validatePhoneNumber: jest.fn(),
  signUp: jest.fn(),
  validUser: jest.fn(),
  signToken: jest.fn(),
};

const mockRequest = {
  body: jest.fn(),
  params: jest.fn(),
  user: jest.fn(),
};

const mockResponse = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  cookie: jest.fn(),
};

const mockNext = jest.fn();

const userController = new UserController(mockUserService);

describe('User Controller Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.

    // mockResponse.status의 경우 메서드 체이닝으로 인해 반환값이 Response(자신: this)로 설정되어야합니다.
    mockResponse.status.mockReturnValue(mockResponse);
  });
  it('signUp method Success', async () => {
    const mockReturn = 'signup complete';
    mockRequest.body = {
      email: 'popcon940633@gmail.com',
      password: '123456',
      passwordCheck: '123456',
      name: '김라임',
      phoneNumber: '010-1111-1111',
      petCategory: 'cat',
    };
    mockUserService.validatePhoneNumber.mockResolvedValue('010-1111-1111');
    mockUserService.signUp.mockResolvedValue(mockReturn);
    await userController.signUp(mockRequest, mockResponse, mockNext);
    expect(mockUserService.validatePhoneNumber).toHaveBeenCalledTimes(1);
    expect(mockUserService.signUp).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: '회원가입 완료', data: mockReturn });
  });
  it('signUp method about invalid arguments', async () => {
    mockRequest.body = {
      email: 'popcon940633@gmail.com',
      password: '123456',
      name: '김라임',
      phoneNumber: '010-1111-1111',
      petCategory: 'cat',
    };
    await userController.signUp(mockRequest, mockResponse, mockNext);
    expect(mockUserService.validatePhoneNumber).toHaveBeenCalledTimes(0);
    expect(mockUserService.signUp).toHaveBeenCalledTimes(0);
    expect(mockNext).toHaveBeenCalledWith(new CustomError(400, '요청이 잘못 되었습니다.'));
  });
  it('signUp method about invalid petCategory', async () => {
    mockRequest.body = {
      email: 'popcon940633@gmail.com',
      password: '123456',
      passwordCheck: '123456',
      name: '김라임',
      phoneNumber: '010-1111-1111',
      petCategory: 'snake',
    };
    await userController.signUp(mockRequest, mockResponse, mockNext);
    expect(mockUserService.validatePhoneNumber).toHaveBeenCalledTimes(0);
    expect(mockUserService.signUp).toHaveBeenCalledTimes(0);
    expect(mockNext).toHaveBeenCalledWith(new CustomError(400, '적절하지 않은 카테고리입니다.'));
  });
  it('signUp method about invalid passwordCheck', async () => {
    mockRequest.body = {
      email: 'popcon940633@gmail.com',
      password: '123456',
      passwordCheck: '676767',
      name: '김라임',
      phoneNumber: '010-1111-1111',
      petCategory: 'cat',
    };
    await userController.signUp(mockRequest, mockResponse, mockNext);
    expect(mockUserService.validatePhoneNumber).toHaveBeenCalledTimes(0);
    expect(mockUserService.signUp).toHaveBeenCalledTimes(0);
    expect(mockNext).toHaveBeenCalledWith(new CustomError(400, '비밀번호를 다시 확인하세요.'));
  });
  it('login method ', async () => {
    const mockReturn = {
      bearerToken: 'mocked accessToken',
      bearerRefreshToken: 'mocked refreshToken',
    };
    mockRequest.body = {
      email: 'popcon940633@gmail.com',
      password: '123456',
    };

    mockUserService.validUser.mockResolvedValue({ userId: 1 });
    mockUserService.signToken.mockResolvedValue(mockReturn);
    await userController.logIn(mockRequest, mockResponse, mockNext);
    expect(mockUserService.validUser).toHaveBeenCalledTimes(1);
    expect(mockUserService.signToken).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      accessToken: mockReturn.bearerToken,
      refreshToken: mockReturn.bearerRefreshToken,
    });
  });
  it('login method about invalid arguments', async () => {
    mockRequest.body = {
      email: 'popcon940633@gmail.com',
    };
    await userController.logIn(mockRequest, mockResponse, mockNext);
    expect(mockUserService.validUser).toHaveBeenCalledTimes(0);
    expect(mockUserService.signToken).toHaveBeenCalledTimes(0);
    expect(mockNext).toHaveBeenCalledWith(new CustomError(400, '요청이 잘못 되었습니다.'));
  });
});
