import path from 'path';
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { setEnvVariables } from './util/envUtil';
import indexRouter from './routes';
import apiRouter from './router';
import errorHandler from './middlewares/common/errorHandler';

setEnvVariables();

const server = express();
server.use(logger('dev'));

server.use(cors());

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(errorHandler);

server.use(cookieParser());
server.use(express.static(path.join(process.cwd(), 'public')));

server.use('/', indexRouter);
server.use('/api', apiRouter);
server.use(errorHandler);

export default server;
