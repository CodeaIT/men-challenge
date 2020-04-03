import path from 'path';
import './util/env';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import indexRouter from './routes';
import apiRouter from './router';
import errorHandler from './middlewares/common/errorHandler';

const app = express();
app.use(logger('dev'));

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(errorHandler);

app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use(errorHandler);

export default app;
