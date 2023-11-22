import { Router } from 'express';
import { featuredController } from '../controllers/featured.controller';
export const featuredRouter = Router();

featuredRouter.get('/', featuredController.getFeaturedTitles);
