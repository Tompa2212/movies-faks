import { inAppNotificationMessagePublisher } from '../config/messaging.config';
import NotFoundError from '../errors/not-found';
import { watchlistInviteRepository } from '../repository/watchlist-invitation.repository';
import { NewWatchlistInvitation } from '../types/Watchlist';
import { watchlistService } from './watchlist.service';

const inviteUsers = async (
  senderId: number,
  watchlistId: number,
  userIds: number[]
) => {
  const insertValues: NewWatchlistInvitation[] = userIds.map((id) => ({
    watchlistId,
    recipientId: id,
    senderId
  }));

  if (!insertValues.length) {
    return [];
  }

  const invites = await watchlistInviteRepository.insertMany(insertValues);

  // insertMany has onConflictDoNothing
  //  - if user is already invited nothing will be inserted, so
  //  return empty array
  if (!invites.length) {
    return [];
  }

  inAppNotificationMessagePublisher({
    type: 'watchlist_invitation',
    data: invites
  });

  return invites;
};

const acceptInvite = async (invitationId: number) => {
  const invitation = await watchlistInviteRepository.deleteById(invitationId);

  if (!invitation) {
    throw new NotFoundError();
  }

  await watchlistService.addUsers(invitation.watchlistId, [
    invitation.recipientId
  ]);

  inAppNotificationMessagePublisher({
    type: 'watchlist_invitation_accept',
    data: invitation
  });
};

export const watchlistInvitationService = {
  inviteUsers,
  acceptInvite
};
