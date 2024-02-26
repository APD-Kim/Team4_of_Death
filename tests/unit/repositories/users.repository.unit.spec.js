import { beforeEach, describe, expect, jest } from '@jest/globals';
import { UserRepository } from '../../../src/repositories/users.repository';

const mockPrisma = {
  $transaction: jest.fn(),
  users: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  points: {
    create: jest.fn(),
  },
};

const userRepository = new UserRepository(mockPrisma);

describe('User Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('findUserByEmail Method', async () => {
    const mockReturn = 'Email String';
    const findParams = {
      email: 'findUserEmail',
    };
    mockPrisma.users.findFirst.mockResolvedValue(mockReturn);
    const findUserData = await userRepository.findUserByEmail(findParams.email);
    expect(findUserData).toEqual(mockReturn);
    expect(mockPrisma.users.findFirst).toHaveBeenCalledTimes(1);
  });
  it('findUserByEmail Method', async () => {
    const mockReturn = 'userId String';
    const findParams = {
      email: 'findUserEmail',
    };
    mockPrisma.users.findFirst.mockResolvedValue(mockReturn);
    const findUserData = await userRepository.findUserByUserId(findParams.email);
    expect(findUserData).toEqual(mockReturn);
    expect(mockPrisma.users.findFirst).toHaveBeenCalledTimes(1);
  });
  it('signUpWithEmail Method', async () => {
    const findParams = {
      email: 'popcon94062011@gmail.com',
      password: 'hashedPassword',
      name: '김라임',
      phoneNumber: '010-4311-1620',
      petCategory: 'cat',
    };
    const mockUserCreationResult = { userId: 1, email: 'popcon94062011@gmail.com' };
    const mockPointCreationResult = { pointId: 'some-random-id', userId: 1, point: 1000 };
    mockPrisma.users.create.mockResolvedValue(mockUserCreationResult);
    mockPrisma.points.create.mockResolvedValue(mockPointCreationResult);
    mockPrisma.$transaction.mockImplementation((cb) => cb(mockPrisma));
    const result = await userRepository.signUpWithEmail(
      findParams.email,
      findParams.password,
      findParams.name,
      findParams.phoneNumber,
      findParams.petCategory
    );
    expect(result).toEqual({ createdUser: mockUserCreationResult, point: mockPointCreationResult });
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
  });
  it('findUserByPhoneNumber Method', async () => {
    const mockReturn = 'phoneNumber String';
    const findParams = {
      phoneNumber: '010-1111-1111',
    };
    mockPrisma.users.findFirst.mockResolvedValue(mockReturn);
    const findUserData = await userRepository.findUserByPhoneNumber(findParams.phoneNumber);
    expect(findUserData).toEqual(mockReturn);
    expect(mockPrisma.users.findFirst).toHaveBeenCalledTimes(1);
    expect(mockPrisma.users.findFirst).toHaveBeenCalledWith({ where: { phoneNumber: findParams.phoneNumber } });
  });
});
