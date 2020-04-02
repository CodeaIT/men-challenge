import expressValidator from 'express-validator';
import { MIN_PASSWORD_LENGTH } from '../../../models/user';
import locales from '../../../locales/en.json';

const { PASSWORD_INVALID_LENGTH } = locales.user.validations;

const { check } = expressValidator;

const validatePassword = check('password')
  .isString()
  .isLength({ min: MIN_PASSWORD_LENGTH })
  .withMessage(`${PASSWORD_INVALID_LENGTH} ${MIN_PASSWORD_LENGTH}`);

export default validatePassword;
