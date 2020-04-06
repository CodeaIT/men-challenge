import express from 'express';

import authRouter from './routes/authRouter';
import userRouter from './routes/userRouter';
import postRouter from './routes/postRouter';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/posts', postRouter);

export default router;
