import expressValidator from 'express-validator';
import userService from '../../../services/user';
import locales from '../../../locales/en.json';

const { EMAIL_ALREADY_IN_USE } = locales.user.validations;
const { check } = expressValidator;

const validateUniqueEmail = check('email').custom(async (email) => {
  const user = await userService.findByEmail(email);
  if (user) {
    return Promise.reject(new Error(EMAIL_ALREADY_IN_USE));
  }
  return Promise.resolve();
});

export default validateUniqueEmail;
