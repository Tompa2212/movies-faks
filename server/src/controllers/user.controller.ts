import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { StatusCodes } from 'http-status-codes';
import { updateBasicUserInfoSchema } from '../schema/user.schema';
import { zParse } from '../utils/z-parse';
import BadRequestError from '../errors/bad-request';
import ForbiddenError from '../errors/forbidden';
import { watchlistService } from '../services/watchlist.service';
import { notificationService } from '../services/notification.service';

const getUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (Number.isNaN(id)) {
    throw new BadRequestError({
      description: `Invalid type, id should be of type number`
    });
  }

  if (req.session.user.id !== id) {
    throw new ForbiddenError();
  }

  const user = await userService.getUser(id);

  return res.status(StatusCodes.OK).json({ data: user });
};

const deleteUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (Number.isNaN(id)) {
    throw new BadRequestError({
      description: `Invalid type, id should be of type number`
    });
  }

  if (req.session.user.id !== id) {
    throw new ForbiddenError();
  }

  req.session.destroy((err) => {
    if (err) {
      throw err;
    }

    return res.send('OK');
  });
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

  return res.status(StatusCodes.OK).json({ data: user });
};

const searchUsersByEmail = async (req: Request, res: Response) => {
  const { email } = req.params;

  const users = await userService.searchUsersByEmail(email);

  return res.status(200).json({ data: users });
};

const getUserWatchlists = async (req: Request, res: Response) => {
  const { id: userId } = req.params;

  if (req.session.user.id !== parseInt(userId)) {
    throw new ForbiddenError();
  }

  const data = await watchlistService.getUserWatchlists(parseInt(userId));

  return res.status(StatusCodes.OK).json({ data });
};

const getUserNotifications = async (req: Request, res: Response) => {
  const { id: userId } = req.params;

  if (req.session.user.id !== parseInt(userId)) {
    throw new ForbiddenError();
  }

  const notifications = await notificationService.getUserNotifications(
    parseInt(userId)
  );

  return res.status(StatusCodes.OK).json({ data: notifications });
};

const markAllUserNotificationsSeen = async (req: Request, res: Response) => {
  await notificationService.markUsersNotificationsSeen(req.session.user.id);

  return res.status(StatusCodes.OK).end();
};

export const userController = {
  getUser,
  deleteUser,
  updateUser,
  searchUsersByEmail,
  getUserWatchlists,
  getUserNotifications,
  markAllUserNotificationsSeen
};
