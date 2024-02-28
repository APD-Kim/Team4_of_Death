import { beforeEach, describe, expect, jest } from '@jest/globals';
import { TrainerRepository } from '../../../src/repositories/trainers.repository.js';
import { encodeXText } from 'nodemailer/lib/shared/index.js';

const mockPrisma = {
  trainers: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  },
  users: {
    update: jest.fn(),
  },
};

const trainerRepository = new TrainerRepository(mockPrisma);

describe('Trainer Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('findTrainerByCategory Method Success', async () => {
    const mockReturn = 'findTrainerByCategory complete';
    const findParams = {
      petCategory: 'dog',
    };
    mockPrisma.trainers.findMany.mockResolvedValue(mockReturn);
    const trainerList = await trainerRepository.findTrainerByCategory(findParams.petCategory);
    expect(trainerList).toEqual(mockReturn);
    expect(mockPrisma.trainers.findMany).toHaveBeenCalledTimes(1);
    expect(trainerList).toBe(mockReturn);
  });

  it('createRegisterTrainer', async () => {
    const mockReturn = 'create registerTrainer Return String';
    mockPrisma.trainers.create.mockReturnValue(mockReturn);
    mockPrisma.trainers.update.mockReturnValue(mockReturn);

    const createParams = {
      userId: 'createRegisterTrainerUserId',
      price: 'createRegisterTrainerPrice',
      career: 'createRegisterTrainerCareer',
      petCategory: 'createRegisterTrainerPetCategory',
      address: 'createRegisterTrainerAddress',
    };

    const createTrainerData = await trainerRepository.registerTrainer(
      createParams.userId,
      createParams.price,
      createParams.career,
      createParams.petCategory,
      createParams.address
    );

    expect(createTrainerData).toEqual(mockReturn);
    expect(mockPrisma.trainers.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.trainers.create).toHaveBeenCalledWith({
      data: {
        userId: createParams.userId,
        price: createParams.price,
        career: createParams.career,
        petCategory: createParams.petCategory,
        address: createParams.address,
      },
    });
  });

  it('findAllTrainer', async () => {
    const mockReturn = 'findMany String';
    mockPrisma.trainers.findMany.mockReturnValue(mockReturn);

    const findAllTrainerData = await trainerRepository.findAllTrainer();

    expect(findAllTrainerData).toBe(mockReturn);
    expect(trainerRepository.prisma.trainers.findMany).toHaveBeenCalledTimes(1);
  });

  it('findOneTrainer', async () => {
    const mockReturn = 'findFirst String';
    mockPrisma.trainers.findFirst.mockResolvedValue(mockReturn);

    const findOneTrainerData = await trainerRepository.findOneTrainer(1);

    expect(findOneTrainerData).toEqual(mockReturn);
    expect(trainerRepository.prisma.trainers.findFirst).toHaveBeenCalledTimes(1);
    // expect(trainerRepository.prisma.trainers.findFirst).toHaveBeenCalledWith({
    //   where: {
    //     reviewId: +1,
    //   },
    //   include: {
    //     userId: true,
    //   },
    // });
  });

  it('updateTrainer', async () => {
    const mockReturn = 'update String';
    mockPrisma.trainers.update.mockResolvedValue(mockReturn);

    const updateTrainerData = await trainerRepository.updateTrainer(1, 2, 'dog', '서울시 종로구', 300);

    expect(updateTrainerData).toEqual(mockReturn);
    expect(mockPrisma.trainers.update).toHaveBeenCalledTimes(1);
    expect(mockPrisma.trainers.update).toHaveBeenCalledWith({
      where: {
        trainerId: +1,
      },
      data: {
        career: 2,
        petCategory: 'dog',
        address: '서울시 종로구',
        price: 300,
      },
    });
  });

  it('deleteTrainer', async () => {
    const mockReturn = 'delete String';
    mockPrisma.trainers.delete.mockResolvedValue(mockReturn);

    const deleteTrainerData = await trainerRepository.deleteTrainer(1);

    expect(deleteTrainerData).toEqual(mockReturn);
    expect(mockPrisma.trainers.delete).toHaveBeenCalledTimes(1);
    expect(mockPrisma.trainers.delete).toHaveBeenCalledWith({
      where: { trainerId: +1 },
    });
  });

  it('findOneUser', async () => {
    const mockReturn = 'findFirst String';
    mockPrisma.trainers.findFirst.mockReturnValue(mockReturn);

    const findOneUserData = await trainerRepository.findOneUser(1);

    expect(findOneUserData).toEqual(mockReturn);
    expect(trainerRepository.prisma.trainers.findFirst).toHaveBeenCalledTimes(1);
    // expect(trainerRepository.prisma.trainers.findFirst).toHaveBeenCalledWith(
    //   {
    //     userId: 1,
    //   },
    //   {
    //     users: {
    //       name: '김라임',
    //       email: 'popcon9406201@gmail.com',
    //       password: '123456',
    //       profileImg: null,
    //       phoneNumber: '010-4311-1111',
    //       role: 'user',
    //       petCategory: 'cat',
    //       createdAt: '2024-02-24T05:09:47.025Z',
    //       updatedAt: '2024-02-24T05:09:47.025Z',
    //       isTrainer: false,
    //     },
    //   }
    // );
  });
});
