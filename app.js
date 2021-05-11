import app from './src/server';
import logger from './src/utils/logger';
import connection from './src/database/connection';

const { connectToDatabase } = connection;
const { PORT } = process.env;

app.listen(PORT || 3000, async () => {
  logger.info(`App listening on port ${process.env.PORT}!`);
  await connectToDatabase();
});

export default app;
