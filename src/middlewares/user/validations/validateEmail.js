import expressValidator from 'express-validator';
import locales from '../../../locales/en.json';

const { EMAIL_NOT_VALID } = locales.user.validations;

const { check } = expressValidator;

const validateEmail = check('email')
  .exists()
  .isEmail()
  .withMessage(EMAIL_NOT_VALID);

export default validateEmail;
