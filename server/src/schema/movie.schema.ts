import * as z from 'zod';
import { createPaginationValidation } from './pagination.schema';

export const movieSearchSchema = z.object({
  query: z.object({
    title: z.string(),
    ...createPaginationValidation()
  })
});
