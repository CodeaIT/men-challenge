import app from './src/server';
import logger from './src/utils/logger';
import connection from './src/database/connection';

const { connectToDatabase, seedDatabase } = connection;
const NODE_ENV_TEST = 'test';
const { NODE_ENV, PORT } = process.env;

app.listen(PORT || 3000, async () => {
  logger.info(`App listening on port ${process.env.PORT}!`);
  await connectToDatabase();
  if (NODE_ENV !== NODE_ENV_TEST) seedDatabase();
});

export default app;
