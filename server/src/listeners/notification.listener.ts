import { consumeInAppNotificationQueue } from '../config/messaging.config';
import { notificationService } from '../services/notification.service';
import { NewNotification } from '../types/Notification';

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

          // throw new Error('aa');
          const inserted = await notificationService.createNotifications(
            notifications
          );
          // console.log('heree');
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
