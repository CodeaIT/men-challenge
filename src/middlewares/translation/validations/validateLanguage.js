import { check } from 'express-validator';
import errorCodes from '../../../constants/errorCodes';
import languages from '../../../constants/languages';

const { LANGUAGE_NOT_VALID } = errorCodes;

const validateLanguage = check('lang', LANGUAGE_NOT_VALID)
  .exists()
  .isString()
  .custom(async (lang, { req }) => {
    if (!Object.values(languages).includes(lang)) {
      return Promise.reject(new Error(LANGUAGE_NOT_VALID));
    }
    req.lang = lang;
    return Promise.resolve();
  });

export default validateLanguage;
