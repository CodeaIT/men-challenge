import 'dotenv/config';
import app from './src/server';
import logger from './src/util/logger';

app.listen(process.env.PORT || 3000, () => {
  logger.info(`App listening on port ${process.env.PORT}!`);
});

export default app;
