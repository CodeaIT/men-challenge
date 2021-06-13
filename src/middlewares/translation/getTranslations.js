import fs from 'fs';
import path from 'path';
import { StatusCodes } from 'http-status-codes';

const getTranslationsByLang = (req, res, next) => {
  const translations = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, `../../locales/${req.lang}.json`)),
  );

  res.status(StatusCodes.OK).send(translations);
  return next();
};

export default getTranslationsByLang;
