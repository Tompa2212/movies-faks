import * as z from 'zod';

export const inviteUsersToWatchlistsSchema = z.object({
  body: z.object({
    watchlistId: z
      .number({ required_error: 'Provide watchlist id.' })
      .positive(),
    userIds: z
      .array(
        z
          .number({
            invalid_type_error: 'Users value should be positive number array.'
          })
          .positive(),
        {
          required_error: 'Provide users to invite.'
        }
      )
      .nonempty()
  })
});
