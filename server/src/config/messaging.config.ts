import amqp from 'amqplib';
import { WatchlistInvitation } from '../types/Watchlist';

const exchangesConfig = [
  {
    name: 'notifications',
    options: { durable: true } as amqp.Options.AssertExchange,
    type: 'direct',
    queues: [
      {
        routeKey: 'in-app-notifications',
        name: 'queue-in-app-notifications',
        options: {}
      }
    ]
  }
] as const;

type ExchangeName = (typeof exchangesConfig)[number]['name'];
type RouteKey = (typeof exchangesConfig)[number]['queues'][number]['routeKey'];
type QueueName = (typeof exchangesConfig)[number]['queues'][number]['name'];

let amqpConnection: amqp.Connection;
let amqpChannel: amqp.Channel;

export const connectAll = async () => {
  amqpConnection = await amqp.connect('amqp://localhost');
  amqpChannel = await amqpConnection.createChannel();

  if (process.env.NODE_ENV !== 'development') {
    // amqpChannel.deleteExchange('notifications');
    // amqpChannel.deleteQueue('queue-in-app-notifications');
  }

  for (let { name: exchangeName, options, type, queues } of exchangesConfig) {
    await amqpChannel.assertExchange(exchangeName, type, options);

    for (let { routeKey, options, name } of queues) {
      const q = await amqpChannel.assertQueue(name, options);

      await amqpChannel.bindQueue(q.queue, exchangeName, routeKey);
    }
  }
};

const createChannel = async () => {
  if (!amqpConnection) {
    await connectAll();
  }
  const channel = await amqpConnection.createChannel();

  for (let { name: exchangeName, options, type, queues } of exchangesConfig) {
    await amqpChannel.assertExchange(exchangeName, type, options);

    for (let { routeKey, options, name } of queues) {
      const q = await amqpChannel.assertQueue(name, options);

      await amqpChannel.bindQueue(q.queue, exchangeName, routeKey);
    }
  }

  return channel;
};

export const closeAmqpConnection = async () => {
  await amqpChannel.close();
  await amqpConnection.close();
};

const publishMessage = async (
  exchange: ExchangeName,
  routeKey: RouteKey,
  message: Buffer,
  options?: amqp.Options.Publish
) => {
  if (!amqpChannel) {
    await connectAll();
  }

  amqpChannel.publish(exchange, routeKey, message, options);
};

const consumeQueue = async (
  channel: amqp.Channel,
  queueName: QueueName,
  onMessage: (msg: amqp.ConsumeMessage | null) => void,
  options?: amqp.Options.Consume
) => {
  channel.consume(queueName, onMessage, options);
};

type InAppNotificationMessage =
  | {
      type: 'watchlist_invitation';
      data: WatchlistInvitation[];
    }
  | {
      type: 'watchlist_invitation_accept';
      data: WatchlistInvitation;
    };

export const inAppNotificationMessagePublisher = (
  message: InAppNotificationMessage
) => {
  publishMessage(
    'notifications',
    'in-app-notifications',
    Buffer.from(JSON.stringify(message))
  );
};

export const consumeInAppNotificationQueue = async (
  onMessage: (
    data: undefined | InAppNotificationMessage,
    acknowledge: () => void
  ) => void
) => {
  const channel = await createChannel();

  consumeQueue(
    channel,
    'queue-in-app-notifications',
    (msg) => {
      if (!msg) {
        return;
      }

      onMessage(JSON.parse(msg?.content.toString()), () => {
        channel.ack(msg);
      });
    },
    { noAck: false }
  );
};
