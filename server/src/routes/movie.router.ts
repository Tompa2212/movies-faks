import { Router } from 'express';
import { movieController } from '../controllers/movie.controller';

export const movieRouter = Router();

movieRouter.get('/top-250', movieController.getTop250);
