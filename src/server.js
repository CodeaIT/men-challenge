import path from 'path';
import express from 'express';
import expressOasGenerator from 'express-oas-generator';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { setEnvVariables } from './utils/envUtil';
import indexRouter from './routes';
import apiRouter from './router';
import errorHandler from './middlewares/common/errorHandler';

setEnvVariables();

const NODE_ENV_TEST = 'test';
const { NODE_ENV } = process.env;
const swaggerDocumentPath = './api-docs.json';
let swaggerDocument = {};
if (fs.existsSync(swaggerDocumentPath)) {
  swaggerDocument = JSON.parse(fs.readFileSync(swaggerDocumentPath));
}

const server = express();

if (NODE_ENV === NODE_ENV_TEST) {
  expressOasGenerator.handleResponses(server, {
    predefinedSpec(spec) {
      return spec;
    },
    specOutputPath: swaggerDocumentPath,
  });
} else {
  server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

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
if (NODE_ENV === NODE_ENV_TEST) {
  expressOasGenerator.handleRequests();
}

export default server;
