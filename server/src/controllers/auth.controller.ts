import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authController = (authService: AuthService) => {
  return {
    async login(req: Request, res: Response) {
      res.send('dinamo');
    },
    async register(req: Request, res: Response) {}
  };
};

export default authController;
