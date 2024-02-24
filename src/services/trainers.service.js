import CustomError from '../utils/errorHandler.js';

export class TrainerService {
  constructor(trainerRepository) {
    this.trainerRepository = trainerRepository;
  }

  registerTrainer = async (userId, price, career, petCategory, address) => {
    const user = await this.trainerRepository.findOneUser(userId);
    console.log('여기가 콘솔임', user);

    if (user !== null) {
      if (user.users.isTrainer === true) {
        throw new CustomError(400, '이미 트레이너로 등록된 사용자 입니다.');
      }
    }

    if (!career || !petCategory || !address) {
      throw new CustomError(400, '트레이너 등록을 위한 필수 정보가 누락되었습니다.');
    }

    const trainers = await this.trainerRepository.registerTrainer(userId, price, career, petCategory, address);
    return trainers;
  };

  findAllTrainer = async () => {
    const trainer = await this.trainerRepository.findAllTrainer();
    if (!trainer.length) {
      throw new CustomError(400, '트레이너가 없습니다.');
    }
    return trainer;
  };

  findOneTrainer = async (trainerId) => {
    const trainer = await this.trainerRepository.findOneTrainer(trainerId);
    if (!trainer) {
      throw new CustomError(400, '트레이너가 존재하지 않습니다.');
    }
    return trainer;
  };
}
