import CustomError from '../utils/errorHandler.js';

export class TrainerController {
  constructor(trainerService) {
    this.trainerService = trainerService;
  }

  registerTrainer = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { price, career, petCategory, address } = req.body;

      if (!price || !career || !petCategory || !address) {
        throw new CustomError(404, '형식이 맞지 않습니다.');
      }

      const trainer = await this.trainerService.registerTrainer(userId, price, career, petCategory, address);

      return res.status(202).json({ message: trainer });
    } catch (err) {
      next(err);
    }
  };

  findAllTrainer = async (req, res, next) => {
    try {
      const trainer = await this.trainerService.findAllTrainer();
      return res.status(202).json({ message: trainer });
    } catch (err) {
      next(err);
    }
  };

  findOneTrainer = async (req, res, next) => {
    try {
      const { trainerId } = req.params;
      if (!trainerId) {
        throw new CustomError(404, 'trainer 아이디가 올바르지 않습니다.');
      }

      const trainer = await this.trainerService.findOneTrainer(trainerId);
      return res.status(200).json({ message: trainer });
    } catch (err) {
      next(err);
    }
  };

  likesTrainer = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { trainerId } = req.params;
      const findTrainer = await this.trainerService.findOneTrainer(trainerId);
      if (userId === findTrainer.userId) {
        throw new CustomError(400, '자기 자신에게 좋아요를 누를 수 없습니다.');
      }
      const likeTrainer = await this.trainerService.likeTrainer(userId, trainerId);
      if (likeTrainer.status === 'cancelLiked') {
        return res.status(201).json({ message: '성공적으로 좋아요를 취소했습니다.' });
      }
      res.status(201).json({ message: '성공적으로 좋아요를 눌렀습니다.' });
    } catch (err) {
      next(err);
    }
  };

  /**카테고리별 펫시터 조회 */
  findTrainerByCategory = async (req, res, next) => {
    try {
      let { category } = req.params;
      if (!category) {
        throw new CustomError(400, 'category 값이 비어있습니다.');
      }
      category = category.toLowerCase();

      if (!['dog', 'cat', 'bird'].includes(category)) {
        throw new CustomError(400, 'category 가 올바르지 않습니다.');
      }

      const trainerList = await this.trainerService.findTrainerByCategory(category);
      if (!trainerList) {
        throw new CustomError(400, '해당 카테고리에 조회된 트레이너가 없습니다.');
      }

      return res.status(200).json({ message: '카테고리별 펫시터 조회 완료', data: trainerList });
    } catch (err) {
      next(err);
    }
  };

  updateTrainer = async (req, res, next) => {
    try {
      const { trainerId } = req.params;
      if (!trainerId) {
        throw new CustomError(404, 'trainer 아이디가 올바르지 않습니다..');
      }
      const { career, petCategory, address, price } = req.body;
      if (!career || !petCategory || !address || !price) {
        throw new CustomError(404, '형식이 맞지 않습니다.');
      }
      const trainer = await this.trainerService.updateTrainer(trainerId, career, petCategory, address, price);
      return res.status(200).json({ message: trainer });
    } catch (err) {
      next(err);
    }
  };

  deleteTrainer = async (req, res, next) => {
    try {
      const { trainerId } = req.params;
      if (!trainerId) {
        throw new CustomError(404, 'trainer 아이디가 올바르지 않습니다..');
      }

      await this.trainerService.deleteTrainer(trainerId);
      return res.status(200).json({ message: '정상적으로 삭제되었습니다.' });
    } catch (err) {
      next(err);
    }
  };

  findTrainersNoDate = async (req, res, next) => {
    try {
      const { startDate, endDate } = req.body;

      const reservationPossibleTrainers = await this.trainerService.findTrainersNoDate(startDate, endDate);

      return res.status(200).json({ data: reservationPossibleTrainers });
    } catch (err) {
      next(err);
    }
  };
}
