import { z } from 'zod';

export const claimLinkSchema = z.object({
  body: z.object({
    link_code: z.string().min(4).max(10)
  })
});
