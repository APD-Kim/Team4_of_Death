import CustomError from '../utils/errorHandler.js';

export class TrainerService {
  constructor(trainerRepository) {
    this.trainerRepository = trainerRepository;
  }

  registerTrainer = async (userId, price, career, petCategory, address) => {
    const trainers = await this.trainerRepository.registerTrainer(userId, price, career, petCategory, address);
    return trainers;
  };

  findAllTrainer = async () => {
    const trainer = await this.trainerRepository.findAllTrainer();
    if (!trainer.length) {
      throw new CustomError(400, '트레이너 없는데용?');
    }
    return trainer;
  };

  findOneTrainer = async (trainerId) => {
    const trainer = await this.trainerRepository.findOneTrainer(trainerId);
    if (!trainer) {
      throw new CustomError(400, '그런 사람업슨ㄴ데용?');
    }
    return trainer;
  };
}
