import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { featuredService } from '../services/featured.service';

const getFeaturedTitles = async (req: Request, res: Response) => {
  const data = await featuredService.getFeaturedTitles();

  return res.status(StatusCodes.OK).json({ data });
};

export const featuredController = {
  getFeaturedTitles
};
