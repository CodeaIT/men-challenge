import path from 'path';
import express from 'express';
import expressOasGenerator from 'express-oas-generator';
import fs from 'fs';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import { setEnvVariables } from './utils/envUtil';
import indexRouter from './routes';
import apiRouter from './router';
import errorHandler from './middlewares/common/errorHandler';

setEnvVariables();

const swaggerDocumentPath = './api-docs.json';
let swaggerDocument;
if (fs.existsSync(swaggerDocumentPath)) {
  swaggerDocument = JSON.parse(fs.readFileSync(swaggerDocumentPath));
}

const server = express();

const mongooseModels = mongoose.modelNames();
const AUTH_TAG = 'Auth';

expressOasGenerator.handleResponses(server, {
  predefinedSpec(spec) {
    return swaggerDocument || spec;
  },
  specOutputPath: swaggerDocumentPath,
  mongooseModels,
  tags: mongooseModels.concat(AUTH_TAG),
});

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
expressOasGenerator.handleRequests();

export default server;
