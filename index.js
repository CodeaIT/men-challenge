import 'dotenv/config';
import app from './src/server';
import logger from './src/util/logger';

import indexRouter from './src/routes/index';
import usersRouter from './src/routes/users';

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(process.env.PORT || 3000, () => {
  logger.info(`App listening on port ${process.env.PORT}!`);
});

export default app;
