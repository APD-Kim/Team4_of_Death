export class TrainerService {
  constructor(trainerRepository) {
    this.trainerRepository = trainerRepository;
  }

  registerTrainer = async (userId, trainerName, price, career, petCategory, address) => {
    const trainers = await this.trainerRepository.registerTrainer(
      userId,
      trainerName,
      price,
      career,
      petCategory,
      address
    );
    return trainers;
  };

  /**카테고리별 펫시터 조회 */
  findTrainerByCategory = async (category) => {
    const trainerList = await this.trainerRepository.findTrainerByCategory(category);
    return trainerList;
  };
}
