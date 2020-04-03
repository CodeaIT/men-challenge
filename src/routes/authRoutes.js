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

const authRoutes = express.Router();

const commonValidations = [validateEmail, validatePassword];

const authMiddlewares = validateBody(commonValidations);
authRoutes.post('/', authMiddlewares, authUser);

const registerValidations = commonValidations.concat(validateUniqueEmail);
const registerMiddlewares = validateBody(registerValidations);
authRoutes.post('/register', registerMiddlewares, registerUser);

export default authRoutes;
