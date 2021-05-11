import { check } from 'express-validator';
import { MAX_BODY_LENGTH } from '../../../models/post';
import locales from '../../../locales/en.json';

const { BODY_INVALID_LENGTH } = locales.post.validations;

const validateTitle = check('body')
  .isString()
  .isLength({ min: 0, max: MAX_BODY_LENGTH })
  .withMessage(`${BODY_INVALID_LENGTH} ${MAX_BODY_LENGTH}`);

export default validateTitle;
