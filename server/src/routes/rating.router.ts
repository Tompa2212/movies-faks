import { Router } from 'express';
import { ratingController } from '../controllers/rating.controller';
export const ratingRouter = Router();

ratingRouter.get('/', ratingController.getUserRatings);
ratingRouter.post('/', ratingController.createRating);

ratingRouter.route('/:id').delete(ratingController.deleteRating);
