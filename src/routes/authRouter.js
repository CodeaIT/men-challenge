import express from 'express';
import userMiddlewares from '../middlewares/user';
import commonValidations from '../middlewares/common/validations';
import userValidations from '../middlewares/user/validations';

const {
  validateEmail,
  validatePassword,
  validateUniqueEmail,
} = userValidations;
const { validateBody } = commonValidations;
const { authUser, registerUser } = userMiddlewares;

const authRouter = express.Router();

const authValidations = [validateEmail, validatePassword];

const authMiddlewares = validateBody(authValidations);
authRouter.post('/', authMiddlewares, authUser);

const registerValidations = authValidations.concat(validateUniqueEmail);
const registerMiddlewares = validateBody(registerValidations);
authRouter.post('/register', registerMiddlewares, registerUser);

export default authRouter;
