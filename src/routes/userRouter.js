import express from 'express';
import { isAuthorized } from '../middlewares/common/isAuthorized';

const authRouter = express.Router();

authRouter.get('/me', isAuthorized, (req, res) => {
  res.status(200).send(req.user);
});

export default authRouter;
