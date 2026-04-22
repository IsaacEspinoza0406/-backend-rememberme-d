import { z } from 'zod';

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['taken']),
    taken_at: z.string().optional()
  }),
  params: z.object({
    id: z.string()
  })
});
