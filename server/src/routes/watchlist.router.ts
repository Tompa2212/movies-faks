import { Router } from 'express';

export const watchlistRouter = Router();

watchlistRouter.route('/:userId/watchlists/').get(async (req, res) => {
  return res.send('OK');
});
