import expressValidator from 'express-validator';
import { MAX_TITLE_LENGTH } from '../../../models/post';
import locales from '../../../locales/en.json';

const { TITLE_INVALID_LENGTH } = locales.post.validations;

const { check } = expressValidator;

const validateTitle = check('title')
  .isString()
  .isLength({ min: 0, max: MAX_TITLE_LENGTH })
  .withMessage(`${TITLE_INVALID_LENGTH} ${MAX_TITLE_LENGTH}`);

export default validateTitle;
