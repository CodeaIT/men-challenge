import express from 'express';

import authRouter from './routes/authRouter';
import userRouter from './routes/userRouter';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);

export default router;
