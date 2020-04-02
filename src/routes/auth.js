import express from 'express';
import userMiddlewares from '../middlewares/user';
import commonMiddlewares from '../middlewares/common/validations';

const { validateBody } = commonMiddlewares;
const { validateUser, authUser, registerUser } = userMiddlewares;

const router = express.Router();

const validateMiddleware = validateBody(validateUser());

router.get('/', validateMiddleware, authUser);

router.post('/register', validateMiddleware, registerUser);

export default router;
