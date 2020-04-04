import express from 'express';
import userMiddlewares from '../middlewares/user';
import commonMiddlewares from '../middlewares/common/validations';
import userValidations from '../middlewares/user/validations';

const {
  validateEmail,
  validatePassword,
  validateUniqueEmail,
} = userValidations;
const { validateBody } = commonMiddlewares;
const { authUser, registerUser } = userMiddlewares;

const authRouter = express.Router();

const commonValidations = [validateEmail, validatePassword];

const authMiddlewares = validateBody(commonValidations);
authRouter.post('/', authMiddlewares, authUser);

const registerValidations = commonValidations.concat(validateUniqueEmail);
const registerMiddlewares = validateBody(registerValidations);
authRouter.post('/register', registerMiddlewares, registerUser);

export default authRouter;
