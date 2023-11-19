import * as z from 'zod';

export const updateBasicUserInfoSchema = z.object({
  body: z
    .object({
      username: z.string().max(32).optional(),
      firstName: z
        .string({ invalid_type_error: 'First name must be a string' })
        .max(64)
        .optional(),
      lastName: z
        .string({ invalid_type_error: 'Last name must be a string' })
        .max(64)
        .optional()
        .nullable()
    })
    .strict(),
  params: z.object({
    id: z.preprocess(
      (a) => parseInt(z.string().parse(a)),
      z.number().positive()
    )
  })
});
