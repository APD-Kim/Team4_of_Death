import { beforeEach, describe, expect, jest } from "@jest/globals"
import { UserRepository } from "../../../src/repositories/users.repository"

const mockPrisma = {
  users: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(), 
    update: jest.fn(),
    delete: jest.fn(), 
  }
}

const userRepository = new UserRepository(mockPrisma)

describe('User Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  })


  it('findUserByEmail Method', async () => {
    const mockReturn = 'Email String'
    const findParams = {
      email: 'findUserEmail'
    }
    mockPrisma.users.findFirst.mockResolvedValue(mockReturn);
    const findUserData = await userRepository.findUserByEmail(findParams.email)
    expect(findUserData).toEqual(mockReturn)
    expect(mockPrisma.users.findFirst).toHaveBeenCalledTimes(1)
    expect(mockPrisma.users.findFirst).toHaveBeenCalledWith({ where: { email: findParams.email } })
  })
  it('signUpWithEmail Method', async () => {
    const mockReturn = 'created String'
    const findParams = {
      "email": "popcon94062011@gmail.com",
      "password": "hashedPassword",
      "name": "김라임",
      "phoneNumber": "010-4311-1620",
      "petCategory": "cat"
    }
    mockPrisma.users.create.mockResolvedValue(mockReturn);
    const createdUserData = await userRepository.signUpWithEmail(
      findParams.email,
      findParams.password,
      findParams.name,
      findParams.phoneNumber,
      findParams.petCategory)
    expect(createdUserData).toEqual(mockReturn)
    expect(mockPrisma.users.create).toHaveBeenCalledTimes(1)
    expect(mockPrisma.users.create).toHaveBeenCalledWith({
      data: {
        email: findParams.email,
        password: findParams.password,
        name: findParams.name,
        phoneNumber: findParams.phoneNumber,
        petCategory: findParams.petCategory
      }
    })
  })
  it('findUserByPhoneNumber Method', async () => {
    const mockReturn = 'phoneNumber String'
    const findParams = {
      phoneNumber: '010-1111-1111'
    }
    mockPrisma.users.findFirst.mockResolvedValue(mockReturn);
    const findUserData = await userRepository.findUserByPhoneNumber(findParams.phoneNumber)
    expect(findUserData).toEqual(mockReturn)
    expect(mockPrisma.users.findFirst).toHaveBeenCalledTimes(1)
    expect(mockPrisma.users.findFirst).toHaveBeenCalledWith({ where: { phoneNumber: findParams.phoneNumber } })

  })
})