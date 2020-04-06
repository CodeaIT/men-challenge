import expressValidator from 'express-validator';
import userService from '../../../services/userService';
import locales from '../../../locales/en.json';

const { USER_NOT_EXISTS } = locales.user.responses;
const { check } = expressValidator;

const validateAuthorExists = check('author')
  .exists()
  .isString()
  .custom(async (authorId) => {
    const user = await userService.findById(authorId);
    if (!user) {
      return Promise.reject(new Error(USER_NOT_EXISTS));
    }
    return Promise.resolve();
  });

export default validateAuthorExists;
