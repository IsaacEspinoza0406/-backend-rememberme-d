import { z } from 'zod';

export const logSymptomSchema = z.object({
  body: z.object({
    symptom_name: z.string().min(1),
    severity: z.number().int().min(1).max(10),
    notes: z.string().optional().nullable()
  })
});
