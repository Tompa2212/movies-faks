import { relations } from 'drizzle-orm';
import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  pgEnum,
  timestamp,
  index,
  primaryKey,
  json,
  uniqueIndex,
  boolean,
  bigint
} from 'drizzle-orm/pg-core';
import { AdapterAccount } from 'next-auth/adapters';

// Users
export const usersTable = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 64 }).notNull(),
    lastName: varchar('last_name', { length: 64 }),
    email: varchar('email', { length: 64 }).notNull().unique(),
    username: varchar('username', { length: 32 }),
    active: boolean('active').default(true),
    emailVerified: timestamp('emailVerified', { mode: 'date' }),
    image: text('image')
  },
  table => ({
    usernameIdx: index('users_username_idx').on(table.username)
  })
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  watchlistUsers: many(watchlistUsersTable),
  ratings: many(ratingsTable),
  notifications: many(notificationsTable),
  sentWatchlistInvitations: many(watchlistInvitationsTable, {
    relationName: 'sender'
  }),
  receivedWatchlistInvitations: many(watchlistInvitationsTable, {
    relationName: 'recipient'
  })
}));

export const accountsTable = pgTable('accounts', {
  id: serial('id').primaryKey(),
  userId: integer('userId')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 255 })
    .$type<AdapterAccount['type']>()
    .notNull(),
  provider: varchar('provider', { length: 255 }).notNull(),
  providerAccountId: text('providerAccountId').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: bigint('expires_at', { mode: 'bigint' }),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state')
});

export const sessionsTable = pgTable('sessions', {
  id: serial('id').primaryKey(),
  sessionToken: varchar('sessionToken', { length: 255 }).notNull(),
  userId: integer('userId')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { withTimezone: true }).notNull()
});

export const verificationTokensTable = pgTable(
  'verification_tokens',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { withTimezone: true }).notNull()
  },
  vt => ({
    compoundKey: primaryKey(vt.identifier, vt.token)
  })
);

// Genres
export const genresTable = pgTable('genres', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 64 })
});

export const genresRelations = relations(genresTable, ({ many }) => ({
  moviesGenres: many(movieGenresTable)
}));

// Movies
export const showTypeEnum = pgEnum('type', ['movie', 'series']);

export const moviesTable = pgTable(
  'movies',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    plot: text('plot'),
    fullPlot: text('full_plot'),
    poster: varchar('poster'),
    runtime: integer('runtime').notNull(),
    released: timestamp('released', { withTimezone: true, mode: 'date' }),
    type: showTypeEnum('type').notNull(),
    releasedYear: integer('released_year'),
    mongoId: varchar('mongoId', { length: 50 })
  },
  table => {
    return {
      titleIdx: index('title_idx').on(table.title)
    };
  }
);

export const moviesRelations = relations(moviesTable, ({ many }) => ({
  movieGenres: many(movieGenresTable),
  watchlistMovies: many(watchlistMoviesTable),
  ratings: many(ratingsTable)
}));

// Movie Genres
export const movieGenresTable = pgTable(
  'movie_genres',
  {
    movieId: integer('movie_id')
      .notNull()
      .references(() => moviesTable.id, { onDelete: 'cascade' }),
    genreId: integer('genre_id')
      .notNull()
      .references(() => genresTable.id, { onDelete: 'cascade' })
  },
  table => ({
    pk: primaryKey(table.movieId, table.genreId),
    movieIdIdx: index('movie_genres_movie_id_idx').on(table.movieId)
  })
);

export const moviesToGenresRelations = relations(
  movieGenresTable,
  ({ one }) => ({
    genre: one(genresTable, {
      fields: [movieGenresTable.genreId],
      references: [genresTable.id]
    }),
    movie: one(moviesTable, {
      fields: [movieGenresTable.movieId],
      references: [moviesTable.id]
    })
  })
);

export const ratingsTable = pgTable(
  'ratings',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => usersTable.id),
    movieId: integer('movie_id')
      .notNull()
      .references(() => moviesTable.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    timestamp: timestamp('timestamp').defaultNow()
  },
  table => ({
    pk: primaryKey(table.userId, table.movieId),
    movieIdIdx: index('movie_id_idx').on(table.movieId)
  })
);

export const ratingsRelations = relations(ratingsTable, ({ one }) => ({
  movie: one(moviesTable, {
    fields: [ratingsTable.movieId],
    references: [moviesTable.id]
  }),
  user: one(usersTable, {
    fields: [ratingsTable.userId],
    references: [usersTable.id]
  })
}));

// Watchlists
export const watchlistsTable = pgTable('watchlists', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 128 }).notNull(),
  ownerId: integer('owner_id')
    .references(() => usersTable.id)
    .notNull()
});

export const watchlistRelations = relations(watchlistsTable, ({ many }) => ({
  watchlistMovies: many(watchlistMoviesTable),
  watchlistUsers: many(watchlistUsersTable)
}));

// Watchlist movies
export const watchlistMoviesTable = pgTable(
  'watchlist_movies',
  {
    watchlistId: integer('watchlist_id')
      .references(() => watchlistsTable.id)
      .notNull(),
    movieId: integer('movie_id')
      .references(() => moviesTable.id, { onDelete: 'cascade' })
      .notNull(),
    order: integer('order')
  },
  table => ({
    pk: primaryKey(table.watchlistId, table.movieId)
  })
);

export const watchlistMoviesRelations = relations(
  watchlistMoviesTable,
  ({ one }) => ({
    watchlist: one(watchlistsTable, {
      fields: [watchlistMoviesTable.watchlistId],
      references: [watchlistsTable.id]
    }),
    movie: one(moviesTable, {
      fields: [watchlistMoviesTable.movieId],
      references: [moviesTable.id]
    })
  })
);

// Watchlist Users
export const watchlistUsersTable = pgTable(
  'watchlist_users',
  {
    watchlistId: integer('watchlist_id')
      .notNull()
      .references(() => watchlistsTable.id),
    userId: integer('user_id')
      .notNull()
      .references(() => usersTable.id)
  },
  table => ({
    pk: primaryKey(table.watchlistId, table.userId)
  })
);

export const watchlistUsersRelations = relations(
  watchlistUsersTable,
  ({ one }) => ({
    watchlist: one(watchlistsTable, {
      fields: [watchlistUsersTable.watchlistId],
      references: [watchlistsTable.id]
    }),
    user: one(usersTable, {
      fields: [watchlistUsersTable.userId],
      references: [usersTable.id]
    })
  })
);

// Watchlist Invitations
export const invitationStatusEnum = pgEnum('invitation_status', [
  'pending',
  'accepted',
  'declined'
]);
export const watchlistInvitationsTable = pgTable(
  'watchlist_invitations',
  {
    watchlistId: integer('watchlist_id')
      .references(() => watchlistsTable.id)
      .notNull(),
    senderId: integer('sender_id')
      .notNull()
      .references(() => usersTable.id),
    recipientId: integer('recipient_id')
      .notNull()
      .references(() => usersTable.id),
    invitationDateTime: timestamp('invitation_date_time', {
      withTimezone: true,
      mode: 'date'
    }).notNull(),
    status: invitationStatusEnum('status').default('pending').notNull()
  },
  table => ({
    pk: primaryKey(table.watchlistId, table.recipientId, table.senderId),
    uniqueSenderRecipientIdx: uniqueIndex('idx_unique_sender_recipient').on(
      table.senderId,
      table.recipientId
    )
  })
);

export const watchlistInvitationsRelations = relations(
  watchlistInvitationsTable,
  ({ one }) => ({
    watchlist: one(watchlistsTable, {
      fields: [watchlistInvitationsTable.watchlistId],
      references: [watchlistsTable.id]
    }),
    sender: one(usersTable, {
      fields: [watchlistInvitationsTable.senderId],
      references: [usersTable.id],
      relationName: 'sender'
    }),
    recipient: one(usersTable, {
      fields: [watchlistInvitationsTable.recipientId],
      references: [usersTable.id],
      relationName: 'recipient'
    })
  })
);

// Notifications
export const notificationStatusEnum = pgEnum('notification_status', [
  'read',
  'unread'
]);

export const notificationTypeEnum = pgEnum('notification_type', [
  'watchlist_invitation',
  'watchlist_invitation_accept',
  'watchlist_added_movie',
  'app_notification'
]);

export const notificationsTable = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => usersTable.id),
  title: varchar('title', { length: 100 }).notNull(),
  content: varchar('content', { length: 500 }).notNull(),
  creationDateTime: timestamp('creation_date_time', {
    withTimezone: true,
    mode: 'date'
  }).defaultNow(),
  status: notificationStatusEnum('status').default('unread').notNull(),
  type: notificationTypeEnum('type').notNull()
});

export const notificationsRelations = relations(
  notificationsTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [notificationsTable.userId],
      references: [usersTable.id]
    })
  })
);

// Events
export const eventTypeEnum = pgEnum('event_type', ['movie_view']);

export const eventsTable = pgTable(
  'events',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => usersTable.id),
    timestamp: timestamp('timestamp').notNull(),
    eventType: eventTypeEnum('event_type').notNull(),
    eventData: json('event_data'),
    movieId: integer('movie_id').references(() => moviesTable.id)
  },
  table => ({
    userIdx: index('idx_user').on(table.userId)
  })
);

// SELECT m.title, m_genres.*, rating.*
// FROM movies m
// LEFT JOIN LATERAL (
//   SELECT array_to_json(array_agg(json_build_object('id', g.id, 'name', g.name))) as genres
//   FROM movie_genres mg
//   INNER JOIN genres g ON mg.genre_id = g.id
//   WHERE mg.movie_id = m.id
//   GROUP BY mg.movie_id
// ) AS m_genres ON TRUE
// LEFT JOIN LATERAL (
// 	SELECT
// 	  AVG(rating) as rating,
// 	  COUNT(rating) as votes
// 	FROM ratings
// 	WHERE movie_id = m.id
// ) as rating ON TRUE
// where rating.rating is not null;
