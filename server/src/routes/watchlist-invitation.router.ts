import { Router } from 'express';
import { watchlistInvitationController } from '../controllers/watchlist-invitation.controller';

export const watchlistInvitationRouter = Router();

watchlistInvitationRouter.post('/', watchlistInvitationController.inviteUsers);

watchlistInvitationRouter.post(
  '/:id/accept',
  watchlistInvitationController.acceptInvite
);

watchlistInvitationRouter.delete(
  '/:id/decline',
  watchlistInvitationController.declineInvite
);
