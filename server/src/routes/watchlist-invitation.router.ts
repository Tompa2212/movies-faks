import { Router } from 'express';
import { watchlistInvitationController } from '../controllers/watchlist-invitation.controller';

export const watchlistInvitationRouter = Router();

watchlistInvitationRouter.post('/', watchlistInvitationController.inviteUsers);
