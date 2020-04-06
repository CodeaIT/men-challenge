import dotenv from 'dotenv';
import fs from 'fs';
import logger from './logger';

export const setEnvVariables = () => {
  try {
    const { NODE_ENV } = process.env;
    if (NODE_ENV) {
      const path = `.env.${NODE_ENV}`;
      if (fs.existsSync(path)) {
        const envConfig = dotenv.parse(fs.readFileSync(path));
        if (envConfig) {
          Object.keys(envConfig).forEach((k) => {
            process.env[k] = envConfig[k];
          });
        }
      }
    }
  } catch (err) {
    logger.info(err);
  }
};

const envUtil = {
  setEnvVariables,
};

export default envUtil;
