import { Router } from 'express';
import { generateInstance } from '../factories/auth.factory';

const authController = generateInstance();

export const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
