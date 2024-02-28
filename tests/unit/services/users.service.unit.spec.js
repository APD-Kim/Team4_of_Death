import { UserService } from '../../../src/services/users.service';
import { beforeEach, describe, expect, jest } from '@jest/globals';
import CustomError from '../../../src/utils/errorHandler';
import bcrypt from 'bcrypt';
const mockUserRepository = {
  findUserByEmail: jest.fn(),
  findUserByPhoneNumber: jest.fn(),
  signUpWithEmail: jest.fn(),
};
const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn(),
};
const userService = new UserService(mockUserRepository);
describe('User Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it('signUp method by Success', async () => {
    const mockReturn = null;

    const returnValue = {
      createdUser: {
        userId: '1',
        email: 'popcon9406201431@gmail.com',
        isTrainer: false,
        name: '김라임',
        phoneNumber: '010-4331-1620',
        petCategory: 'cat',
        role: 'user',
        profileImg: 'http://test.com',
      },
      point: {
        pointId: 2,
        point: 300,
      },
      //날것
    };

    const mockReturnValue = {
      userId: '1',
      name: '김라임',
      email: 'popcon9406201431@gmail.com',
      phoneNumber: '010-4331-1620',
      role: 'user',
      isTrainer: false,
      petCategory: 'cat',
      profileImg: 'http://test.com',
      pointId: 2,
      point: 300,
    };

    const hashed = '1234566';
    mockUserRepository.findUserByEmail.mockResolvedValue(mockReturn);
    mockUserRepository.findUserByPhoneNumber.mockResolvedValue(mockReturn);
    mockBcrypt.hash.mockResolvedValue(hashed);
    mockUserRepository.signUpWithEmail.mockResolvedValue(returnValue);
    const body = {
      email: 'popcon9406201431@gmail.com',
      password: '111222',
      name: '김라임',
      phoneNumber: '010-4331-1620',
      petCategory: 'cat',
      profileImg: 'http://test.com',
    };
    const createdUser = await userService.signUp(
      body.email,
      body.password,
      body.name,
      body.phoneNumber,
      body.petCategory,
      body.profileImg
    );
    expect(createdUser).toEqual(returnValue);
    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findUserByPhoneNumber).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.signUpWithEmail).toHaveBeenCalledTimes(1);
  });
  it('validatePhoneNumber method by Success', async () => {
    const mockReturn = true;
    const mockReturnValue = {
      email: 'popcon9406201431@gmail.com',
      password: '123456',
      name: '김라임',
      phoneNumber: '010-4331-1620',
      petCategory: 'cat',
      profileImg: 'http://test.com',
    };
    try {
      mockUserRepository.findUserByEmail.mockResolvedValue(mockReturn);
      await userService.signUp(
        mockReturnValue.email,
        mockReturnValue.password,
        mockReturnValue.name,
        mockReturnValue.phoneNumber,
        mockReturnValue.petCategory,
        mockReturnValue.profileImg
      );
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('이미 가입된 이메일입니다.');
      expect(err.statusCode).toEqual(409);
    }
    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findUserByPhoneNumber).toHaveBeenCalledTimes(0);
    expect(mockUserRepository.signUpWithEmail).toHaveBeenCalledTimes(0);
  });
  it('validatePhoneNumber method by Success', async () => {
    const mockReturnValue = {
      email: 'popcon9406201431@gmail.com',
      password: '123456',
      name: '김라임',
      phoneNumber: '010-4331-1620',
      petCategory: 'cat',
      profileImg: 'http://test.com',
    };
    try {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      mockUserRepository.findUserByPhoneNumber.mockResolvedValue(true);
      await userService.signUp(
        mockReturnValue.email,
        mockReturnValue.password,
        mockReturnValue.name,
        mockReturnValue.phoneNumber,
        mockReturnValue.petCategory,
        mockReturnValue.profileImg
      );
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('이미 가입된 전화번호입니다.');
      expect(err.statusCode).toEqual(409);
    }
    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findUserByPhoneNumber).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.signUpWithEmail).toHaveBeenCalledTimes(0);
  });
  it('validatePhoneNumber method by Success', async () => {
    const mockArgument = {
      phoneNumber: '010-4316-6222',
    };
    const validateNumber = await userService.validatePhoneNumber(mockArgument.phoneNumber);
    expect(validateNumber).toEqual(true);
  });
  it('validatePhoneNumber method is failed By wrong number', async () => {
    const mockArgument = '010-43162222';
    try {
      await userService.validatePhoneNumber(mockArgument.phoneNumber);
      fail('Expected to throw CustomError but did not');
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('전화번호는 010-xxxx-xxxx로 구성되어야 합니다.');
      expect(err.statusCode).toEqual(400);
    }
  });
  it('validUser method by Success', async () => {
    const mockEmail = 'popcon940620@gmail.com';
    const mockPassword = '123456';
    const mockReturnValue = {
      email: mockEmail,
      password: '$2b$10$A1aPLVuXpVvZqK72qMQBa.2XdhXol1iLSVsNkjVF2Osfy/eFW8hLe',
    };
    mockUserRepository.findUserByEmail.mockResolvedValue(mockReturnValue);
    const validUser = await userService.validUser(mockEmail, mockPassword);
    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(mockEmail);
    expect(validUser).toEqual(mockReturnValue);
  });
  it('validUser method by Failed because can not find user with email', async () => {
    const mockEmail = 'popcon940620@gmail.com';
    const mockPassword = '123456';
    try {
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      const validUser = await userService.validUser(mockEmail, mockPassword);
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('이메일을 다시 한번 확인해주세요.');
      expect(err.statusCode).toEqual(404);
    }
  });
  it('validUser method by Failed because can not find user with email', async () => {
    try {
      const mockEmail = 'popcon940620@gmail.com';
      const mockPassword = '123456';
      const mockReturnValue = {
        email: mockEmail,
        password: '1234567',
      };
      mockUserRepository.findUserByEmail.mockResolvedValue(mockReturnValue);
      const validUser = await userService.validUser(mockEmail, mockPassword);
    } catch (err) {
      expect(err).toBeInstanceOf(CustomError);
      expect(err.message).toEqual('비밀번호를 다시 한번 확인해주세요.');
      expect(err.statusCode).toEqual(400);
    }
  });
});
