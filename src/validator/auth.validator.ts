import z from 'zod';

export const signupSchema = z.object({
  body: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string().min(8, 'password must have a minimum of 8 characters'),
  }),
});

export type signupDto = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export type loginDto = z.infer<typeof loginSchema>;
