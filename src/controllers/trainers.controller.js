export class TrainerController {
  constructor(trainerService) {
    this.trainerService = trainerService;
  }

  registerTrainer = async (req, res, next) => {
    try {
      const { userId, price, career, petCategory, address } = req.body;
      if (!userId || !price || !career || !petCategory || !address) {
        throw new CustomError(404, '형식이 맞지 않습니다.');
      }

      const trainer = await this.trainerService.registerTrainer(userId, price, career, petCategory, address);
      return res.status(202).json({ message: trainer });
    } catch (err) {
      next(err);
    }
  };

  /**카테고리별 펫시터 조회 */
  findTrainerByCategory = async (req, res, next) => {
    try {
      const str = req.query.category;
      const category = str.toLowerCase();

      if (!['dog', 'cat', 'bird'].includes(category)) {
        throw new CustomError(400, 'category 가 올바르지 않습니다.');
      }

      const trainerList = await this.trainerService.findTrainerByCategory(category);

      return res.status(200).json({ message: trainerList });
    } catch (err) {
      next(err);
    }
  };
}
