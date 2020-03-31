import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(cors());

export default app;
