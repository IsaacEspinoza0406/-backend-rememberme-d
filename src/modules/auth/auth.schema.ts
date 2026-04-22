import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    full_name: z.string().min(2),
    phone: z.string().optional(),
    role: z.enum(['PATIENT', 'DOCTOR']),
    date_of_birth: z.string().optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string()
  })
});
