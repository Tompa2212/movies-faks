import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.get('/logout', authController.logout);
authRouter.get('/session', authController.getSession);
