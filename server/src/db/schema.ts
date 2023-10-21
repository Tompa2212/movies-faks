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
  uniqueIndex
} from 'drizzle-orm/pg-core';

// Users
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 64 }).notNull(),
  lastName: varchar('last_name', { length: 64 }),
  password: varchar('password', { length: 255 }).notNull(),
  email: varchar('email', { length: 64 }).notNull().unique()
});

export const usersRelations = relations(users, ({ many }) => ({
  watchlistUsers: many(watchlistUsers),
  ratings: many(ratings),
  notifications: many(notifications),
  sentWatchlistInvitations: many(watchlistInvitations, {
    relationName: 'sender'
  }),
  recievedWatchlistInvitations: many(watchlistInvitations, {
    relationName: 'recipient'
  })
}));

// Genres
export const genres = pgTable('genres', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 64 })
});

export const genresRelations = relations(genres, ({ many }) => ({
  moviesGenres: many(movieGenres)
}));

// Movies
export const showTypeEnum = pgEnum('type', ['movie', 'series']);

export const movies = pgTable(
  'movies',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    plot: text('plot'),
    fullPlot: text('full_plot'),
    poster: varchar('poster', { length: 256 }),
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

export const moviesRelations = relations(movies, ({ many }) => ({
  movieGenres: many(movieGenres),
  watchlistMovies: many(watchlistMovies),
  ratings: many(ratings)
}));

// Movie Genres
export const movieGenres = pgTable(
  'movie_genres',
  {
    movieId: integer('movie_id')
      .notNull()
      .references(() => movies.id),
    genreId: integer('genre_id')
      .notNull()
      .references(() => genres.id)
  },
  table => ({
    pk: primaryKey(table.movieId, table.genreId)
  })
);

export const moviesToGenresRelations = relations(movieGenres, ({ one }) => ({
  genre: one(genres, {
    fields: [movieGenres.genreId],
    references: [genres.id]
  }),
  movie: one(movies, {
    fields: [movieGenres.movieId],
    references: [movies.id]
  })
}));

export const ratings = pgTable(
  'ratings',
  {
    userId: integer('user_id')
      .notNull()
      .references(() => users.id),
    movieId: integer('movie_id')
      .notNull()
      .references(() => movies.id),
    rating: integer('rating').notNull(),
    timestamp: timestamp('timestamp')
  },
  table => ({
    pk: primaryKey(table.userId, table.movieId)
  })
);

export const ratingsRelations = relations(ratings, ({ one }) => ({
  movie: one(movies, {
    fields: [ratings.movieId],
    references: [movies.id]
  }),
  user: one(users, {
    fields: [ratings.userId],
    references: [users.id]
  })
}));

// Watchlists
export const watchlists = pgTable('watchlists', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 128 }).notNull(),
  ownerId: integer('owner_id')
    .references(() => users.id)
    .notNull()
});

export const watchlistRelations = relations(watchlists, ({ many }) => ({
  watchlistMoves: many(watchlistMovies),
  watchlistUsers: many(watchlistUsers)
}));

// Watchlist movies
export const watchlistMovies = pgTable(
  'watchlist_movies',
  {
    watchlistId: integer('watchlist_id')
      .references(() => watchlists.id)
      .notNull(),
    movieId: integer('movie_id')
      .references(() => movies.id)
      .notNull(),
    order: integer('order')
  },
  table => ({
    pk: primaryKey(table.watchlistId, table.movieId)
  })
);

export const watchlistMoviesRelations = relations(
  watchlistMovies,
  ({ one }) => ({
    watchlist: one(watchlists, {
      fields: [watchlistMovies.watchlistId],
      references: [watchlists.id]
    }),
    movie: one(movies, {
      fields: [watchlistMovies.movieId],
      references: [movies.id]
    })
  })
);

// Watchlist Users
export const watchlistUsers = pgTable(
  'watchlist_users',
  {
    watchlistId: integer('watchlist_id')
      .notNull()
      .references(() => watchlists.id),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id)
  },
  table => ({
    pk: primaryKey(table.watchlistId, table.userId)
  })
);

export const watchlistUsersRelations = relations(watchlistUsers, ({ one }) => ({
  watchlist: one(watchlists, {
    fields: [watchlistUsers.watchlistId],
    references: [watchlists.id]
  }),
  user: one(users, {
    fields: [watchlistUsers.userId],
    references: [users.id]
  })
}));

// Watchlist Invitations
export const invitationStatusEnum = pgEnum('invitation_status', [
  'pending',
  'accepted',
  'declined'
]);
export const watchlistInvitations = pgTable(
  'watchlist_invitations',
  {
    watchlistId: integer('watchlist_id').references(() => watchlists.id),
    senderId: integer('sender_id')
      .notNull()
      .references(() => users.id),
    recipientId: integer('recipient_id')
      .notNull()
      .references(() => users.id),
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
  watchlistInvitations,
  ({ one }) => ({
    watchlist: one(watchlists, {
      fields: [watchlistInvitations.watchlistId],
      references: [watchlists.id]
    }),
    sender: one(users, {
      fields: [watchlistInvitations.senderId],
      references: [users.id],
      relationName: 'sender'
    }),
    recipient: one(users, {
      fields: [watchlistInvitations.recipientId],
      references: [users.id],
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
  'watchlist_added_movie'
]);

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  title: varchar('title', { length: 100 }).notNull(),
  content: varchar('content', { length: 500 }).notNull(),
  creationDateTime: timestamp('creation_date_time', {
    withTimezone: true,
    mode: 'date'
  }),
  status: notificationStatusEnum('status').default('unread').notNull()
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id]
  })
}));

// Events
export const eventTypeEnum = pgEnum('event_type', ['movie_view']);

export const events = pgTable(
  'events',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    timestamp: timestamp('timestamp'),
    eventType: eventTypeEnum('event_type').notNull(),
    eventData: json('event_data'),
    movieId: integer('movie_id').references(() => movies.id)
  },
  table => ({
    userIdx: index('idx_user').on(table.userId)
  })
);

// Index created through Postgres
// CREATE INDEX idx_movie_timestamp ON Events (movieId, timestamp DESC);
