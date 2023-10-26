import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { StatusCodes } from 'http-status-codes';
import { updateBasicUserInfoSchema } from '../schema/user.schema';
import { zParse } from '../utils/z-parse';
import BadRequestError from '../errors/bad-request';

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await userService.getUser(parseInt(id));

  return res.status(StatusCodes.OK).json({ user });
};

const deleteUSer = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await userService.deleteUser(parseInt(id));

  return res.json(StatusCodes.OK).json({ user });
};

const updateUser = async (req: Request, res: Response) => {
  const { params, body } = await zParse(updateBasicUserInfoSchema, req);

  if (req.session.user.id !== params.id) {
    throw new BadRequestError({
      description: `You cannot update data for user with id ${params.id}`
    });
  }

  if (Object.keys(body).length === 0) {
    throw new BadRequestError({ description: 'Update data not provided.' });
  }

  const user = await userService.updateUser(params.id, body);

  return res.status(StatusCodes.OK).json({ user });
};

export const userController = { getUser, deleteUSer, updateUser };
