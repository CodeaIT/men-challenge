import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';
import indexRouter from './routes';
import apiRouter from './router';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/api', apiRouter);

export default app;
