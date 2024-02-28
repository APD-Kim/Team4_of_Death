import CustomError from '../utils/errorHandler.js';

export class TrainerService {
  constructor(trainerRepository) {
    this.trainerRepository = trainerRepository;
  }

  registerTrainer = async (userId, price, career, petCategory, address) => {
    const user = await this.trainerRepository.findOneUser(userId);

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
      throw new CustomError(404, '트레이너가 존재하지 않습니다.');
    }
    return trainer;
  };

  likeTrainer = async (userId, trainerId) => {
    const findLike = await this.trainerRepository.existLike(userId, trainerId);
    if (findLike) {
      await this.trainerRepository.cancelLikeTrainer(userId, trainerId);
      return {
        status: 'cancelLiked',
      };
    }
    const liked = await this.trainerRepository.likeTrainer(userId, trainerId);
    if (!liked) {
      throw new CustomError(500, '좋아요 생성중 오류가 발생했습니다.');
    }
    return {
      status: 'liked',
    };
  };

  /**카테고리별 펫시터 조회 */
  findTrainerByCategory = async (category) => {
    const trainerList = await this.trainerRepository.findTrainerByCategory(category);
    if (!trainerList) {
      throw new CustomError(401, '해당 카테고리내 트레이너가 존재하지 않습니다.');
    }
    return trainerList;
  };

  updateTrainer = async (trainerId, career, petCategory, address, price) => {
    const trainer = await this.trainerRepository.updateTrainer(trainerId, career, petCategory, address, price);
    return trainer;
  };

  deleteTrainer = async (trainerId) => {
    const trainer = await this.trainerRepository.deleteTrainer(trainerId);
    return trainer;
  };

  findTrainersNoDate = async (startDate, endDate) => {
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    const regexStartDate = regex.test(startDate);
    const regexEndDate = regex.test(endDate);

    if (!regexStartDate || !regexEndDate) {
      throw new CustomError(400, '날짜 형식이 잘못 됐습니다.');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (start < today) {
      throw new CustomError(400, '조회가 불가합니다.');
    }

    if (start > end) {
      throw new CustomError(400, '시작일자가 종료일자보다 작아야 합니다.');
    }

    const startTime = startDate + 'T00:00:00Z';
    const endTime = endDate + 'T23:59:59Z';

    const noReservedTrainer = await this.trainerRepository.findTrainersNoDate(startTime, endTime);

    return noReservedTrainer;
  };
}
