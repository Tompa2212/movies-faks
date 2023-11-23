import { consumeInAppNotificationQueue } from '../config/messaging.config';
import { getIo } from '../config/socket.config';
import { createNotificationAttributes } from '../repository/notificaton/create-notification-attrs';
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

        const attributes = await Promise.all(
          data.map((item) =>
            createNotificationAttributes({
              type: 'watchlist_invitation',
              data: item
            })
          )
        );

        try {
          const notifications: NewNotification[] = data.map((invite, idx) => {
            const { recipientId, senderId, status } = invite;
            return {
              notifierId: recipientId,
              actorId: senderId,
              type: msg.type,
              attributes: attributes[idx]
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
        }
        break;
      }
      case 'watchlist_invitation_accept': {
        try {
          const { data } = msg;

          const attributes = await createNotificationAttributes({
            type: 'watchlist_invitation_accept',
            data
          });

          const { senderId, recipientId } = data;

          const created = (
            await notificationService.createNotifications([
              {
                attributes,
                notifierId: senderId,
                actorId: recipientId,
                type: msg.type
              }
            ])
          )[0];

          getIo().to(created.notifierId.toString()).emit('new notification');
          acknowledge();
        } catch (error) {
          console.log(error);
        }
        break;
      }
    }
  });
};

export const notificationListener = makeNotificationListener();
