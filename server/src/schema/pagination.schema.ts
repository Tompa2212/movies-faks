import * as z from 'zod';

type Paginaton = {
  page: z.ZodOptional<z.ZodEffects<z.ZodNumber, number, unknown>>;
  size: z.ZodOptional<z.ZodEffects<z.ZodNumber, number, unknown>>;
  sort: z.ZodUnion<
    [z.ZodOptional<z.ZodArray<z.ZodString, 'many'>>, z.ZodOptional<z.ZodString>]
  >;
};

export const createPaginationValidation = (sortableCols?: string[]) => {
  const base: Paginaton = {
    page: z
      .preprocess(
        (a) => parseInt(z.string().parse(a)),
        z.number().nonnegative()
      )
      .optional(),
    size: z
      .preprocess((a) => parseInt(z.string().parse(a)), z.number().positive())
      .optional(),
    sort: z.string().array().optional().or(z.string().optional())
  };

  return {
    ...base
  };
};
