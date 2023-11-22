import { consumeInAppNotificationQueue } from '../config/messaging.config';
import { getIo } from '../config/socket.config';
import { notificationService } from '../services/notification.service';
import { NewNotification } from '../types/Notification';
import _ from 'lodash';

const makeNotificationListener = () => {
  consumeInAppNotificationQueue(async (msg, acknowledge) => {
    if (!msg) {
      return;
    }

    switch (msg.type) {
      case 'watchlist_invitation': {
        const { data } = msg;

        try {
          const notifications: NewNotification[] = data.map((invite) => {
            const { recipientId, senderId, status, ...rest } = invite;
            return {
              notifierId: recipientId,
              actorId: senderId,
              type: msg.type,
              attributes: {
                ...rest
              }
            };
          });

          const created = await notificationService.createNotifications(
            notifications
          );

          const notifys = [...new Set(created.map((row) => row.notifierId))];

          notifys.forEach((n) =>
            getIo().to(n.toString()).emit('new notification')
          );

          acknowledge();
        } catch (error) {
          console.log(error);
        } finally {
          break;
        }
      }
      case 'watchlist_invitation_accept': {
      }
    }
  });
};

export const notificationListener = makeNotificationListener();
