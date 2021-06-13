import { check } from 'express-validator';
import userService from '../../../services/userService';
import errorCodes from '../../../constants/errorCodes';

const { USER_NOT_EXISTS, POST_AUTHOR_INVALID } = errorCodes;

const validateAuthorExists = check('author', POST_AUTHOR_INVALID)
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
