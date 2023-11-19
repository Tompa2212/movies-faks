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

export const watchlistInvitationController = {
  inviteUsers
};
