import mongoose from 'mongoose';
import logger from './src/util/logger';

const connectToDatabase = async () => {
  try {
    const {
      MONGO_USERNAME,
      MONGO_PASSWORD,
      MONGO_HOST,
      MONGO_PORT,
      MONGO_DATABASE,
    } = process.env;

    const mongoOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    const withCredentials = MONGO_USERNAME && MONGO_PASSWORD;

    const mongoCredentials = withCredentials && {
      user: MONGO_USERNAME,
      pass: MONGO_PASSWORD,
    };

    await mongoose.connect(
      `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`,
      { ...mongoCredentials, ...mongoOptions },
    );
  } catch (error) {
    logger.error(error);
  }
};

export default connectToDatabase;
