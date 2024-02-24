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
      throw new CustomError(400, '조회된 트레이너가 없습니다.');
    }
    return trainer;
  };

  findOneTrainer = async (trainerId) => {
    const trainer = await this.trainerRepository.findOneTrainer(trainerId);
    if (!trainer) {
      throw new CustomError(400, '해당 트레이너가 존재하지 않습니다.');
    }
    return trainer;
  };

  /**카테고리별 펫시터 조회 */
  findTrainerByCategory = async (category) => {
    const trainerList = await this.trainerRepository.findTrainerByCategory(category);
    if (!trainerList) {
      throw new CustomError(400, '해당 카테고리내 트레이너가 존재하지 않습니다.');
    }
    return trainerList;
  };
}
