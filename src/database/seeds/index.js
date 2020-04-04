import User from '../../models/user';
import userSeed from './userSeed';
import logger from '../../utils/logger';

const seedModel = async (model, data) => {
  const modelName = model.collection.collectionName;
  logger.info(`Seeding ${modelName}:`);
  const modelCount = await model.countDocuments({});
  if (modelCount > 0) {
    logger.info(`Skipping: Found ${modelCount} ${modelName} records.`);
    return Promise.resolve();
  }
  return model.create(data);
};

const seedsToComplete = [{ model: User, data: userSeed }];

const seedDatabase = async () => {
  try {
    seedsToComplete.map(async (s) => {
      const seededRecords = await seedModel(s.model, s.data);
      logger.info(`Seeded ${seededRecords.length} records:`);
      logger.info(seededRecords);
    });
  } catch (err) {
    logger.err(err);
  }
};

export default seedDatabase;
