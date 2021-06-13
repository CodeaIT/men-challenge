import express from 'express';

import { isAuthorized } from '../middlewares/common/isAuthorized';
import getTranslationsByLang from '../middlewares/translation/getTranslations';
import validateLanguage from '../middlewares/translation/validations/validateLanguage';
import runValidations from '../middlewares/common/validations/validateBody';

const translationRouter = express.Router();

translationRouter.get(
  '/:lang',
  isAuthorized,
  runValidations([validateLanguage]),
  getTranslationsByLang,
);

export default translationRouter;
