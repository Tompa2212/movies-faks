import type { Request } from 'express';
import { AnyZodObject, ZodError, z } from 'zod';
import BadRequestError from '../errors/bad-request';

export async function zParse<T extends AnyZodObject>(
  schema: T,
  req: Request
): Promise<z.infer<T>> {
  try {
    const parsed = await schema.parseAsync(req);
    return parsed;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new BadRequestError({
        description: 'Invalid data provided',
        errors: error.errors.map(err => ({
          message: err.message
        }))
      });
    }

    throw new BadRequestError({ description: 'Invalid data provided' });
  }
}
