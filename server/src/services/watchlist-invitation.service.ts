import { inAppNotificationMessagePublisher } from '../config/messaging.config';
import NotFoundError from '../errors/not-found';
import { watchlistInviteRepository } from '../repository/watchlist-invitation.repository';
import { watchlistUserRepository } from '../repository/watchlist-user.repository';
import { NewWatchlistInvitation } from '../types/Watchlist';
import _ from 'lodash';
import { watchlistService } from './watchlist.service';
import BadRequestError from '../errors/bad-request';

const inviteUsers = async (
  senderId: number,
  watchlistId: number,
  userIds: number[]
) => {
  const watchlistUsers = await watchlistUserRepository.findWatchlistUsers(
    watchlistId
  );

  const newUsers = _.difference(
    userIds,
    watchlistUsers.map((u) => u.userId)
  );

  const insertValues: NewWatchlistInvitation[] = newUsers.map((id) => ({
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

const acceptInvite = async (invitationId: number, userId: number) => {
  const invitation = await watchlistInviteRepository.findById(invitationId);

  if (!invitation) {
    throw new NotFoundError();
  }

  if (invitation.recipientId !== userId) {
    throw new BadRequestError({
      description: "Can't accept invites from other users"
    });
  }

  await watchlistInviteRepository.deleteById(invitationId);
  await watchlistService.addUsers(invitation.watchlistId, [
    invitation.recipientId
  ]);

  inAppNotificationMessagePublisher({
    type: 'watchlist_invitation_accept',
    data: invitation
  });
};

const declineInvite = async (invitationId: number, userId: number) => {
  const invitation = await watchlistInviteRepository.findById(invitationId);

  if (!invitation) {
    throw new NotFoundError();
  }

  if (invitation.recipientId !== userId) {
    throw new BadRequestError({
      description: "Can't accept invites from other users"
    });
  }

  await watchlistInviteRepository.deleteById(invitationId);
};

const getUserWatchlistInvitations = async (userId: number) => {
  const invitations = await watchlistInviteRepository.findByRecipientId(userId);

  return invitations;
};

export const watchlistInvitationService = {
  getUserWatchlistInvitations,
  inviteUsers,
  acceptInvite,
  declineInvite
};
