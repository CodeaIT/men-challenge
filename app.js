import app from './src/server';
import logger from './src/util/logger';
import connectToDatabase from './connection';

app.listen(process.env.PORT || 3000, async () => {
  logger.info(`App listening on port ${process.env.PORT}!`);
  await connectToDatabase();
});

export default app;
