import { StatusCodes } from 'http-status-codes';
import { inviteUsersToWatchlistsSchema } from '../schema/watchlist-invitation.schema';
import { watchlistInvitationService } from '../services/watchlist-invitation.service';
import { zParse } from '../utils/z-parse';
import { Request, Response } from 'express';

const inviteUsers = async (req: Request, res: Response) => {
  const {
    body: { userIds, watchlistId }
  } = await zParse(inviteUsersToWatchlistsSchema, req);

  const senderId = req.session.user.id;

  await watchlistInvitationService.inviteUsers(senderId, watchlistId, userIds);

  return res.send('');
};

const acceptInvite = async (req: Request, res: Response) => {
  const { id } = req.params;

  await watchlistInvitationService.acceptInvite(parseInt(id), req.user.id);

  return res.status(StatusCodes.OK).end();
};

const declineInvite = async (req: Request, res: Response) => {
  const { id } = req.params;

  await watchlistInvitationService.declineInvite(parseInt(id), req.user.id);

  return res.status(StatusCodes.OK).end();
};

export const watchlistInvitationController = {
  inviteUsers,
  acceptInvite,
  declineInvite
};
