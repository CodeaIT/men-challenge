import express from 'express';
import userMiddlewares from '../middlewares/user';
import commonMiddlewares from '../middlewares/common/validators';

const { validateBody } = commonMiddlewares;
const { validateUser, registerUser } = userMiddlewares;

const router = express.Router();

router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.post('/register', validateBody(validateUser()), registerUser);

export default router;
