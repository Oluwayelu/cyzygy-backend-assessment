import z from 'zod';
import { Role } from '@/interfaces/type';

export const addUserSchema = z.object({
  body: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    role: z.nativeEnum(Role),
  }),
});

export type addUserDto = z.infer<typeof addUserSchema>;

export const getUserSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
});

export type getUserDto = z.infer<typeof getUserSchema>;

export const updateUserSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
  body: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    role: z.nativeEnum(Role),
  }),
});

export type updateUserDto = z.infer<typeof updateUserSchema>;

export const deleteUserSchema = z.object({
  params: z.object({
    userId: z.string(),
  }),
});

export type deleteUserDto = z.infer<typeof deleteUserSchema>;
