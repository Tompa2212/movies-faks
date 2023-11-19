'use server';

import * as z from 'zod';
import api from '@/lib/create-fetcher';
import { AxiosError } from 'axios';

const registerUserSchema = z.object({
  email: z
    .string({ required_error: 'Please provide email.' })
    .min(1, 'Please provide email.')
    .email('Invalid email.'),
  password: z
    .string({ required_error: 'Please provide password.' })
    .min(8, 'Minimum password length is 8'),
  firstName: z
    .string({
      invalid_type_error: 'First name must be a string',
      required_error: 'Please provide first name.'
    })
    .max(64, { message: 'First name can have maximum 64 characters' }),
  lastName: z
    .string()
    .max(64, { message: 'Last name can have maximum 64 characters' })
    .optional()
    .nullable()
});

const register = async (formData: FormData) => {
  const dataObj = Object.fromEntries(formData.entries());
  try {
    const data = await registerUserSchema.parseAsync(dataObj);

    await api.post('/auth/register', data);
  } catch (err) {
    if (err instanceof z.ZodError) {
      throw new Error(err.errors[0].message);
    }

    if (err instanceof AxiosError) {
      const description: string | undefined = err.response?.data.description;
      if (!description) {
        throw err;
      }

      if (description.includes('already exists')) {
        throw new Error('Account with that email already exists.');
      }

      throw new Error(err.response?.data.description);
    }

    throw err;
  }
};

export default register;
