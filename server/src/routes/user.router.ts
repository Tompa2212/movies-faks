import { Router } from 'express';

export const userRouter = Router();

userRouter.route('/:id').get(async (req, res) => {
  return res.send('OK');
});
