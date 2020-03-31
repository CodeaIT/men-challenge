import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: process.env.LOGGER_ERROR_FILE,
      level: 'error',
    }),
    new winston.transports.File({ filename: process.env.LOGGER_FILE }),
  ],
});

export default logger;
