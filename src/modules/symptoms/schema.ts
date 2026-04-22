import { z } from 'zod';

export const createSymptomSchema = z.object({
  body: z.object({
    symptom_name: z.string().min(1),
    severity: z.coerce.number().min(1).max(10),
    notes: z.string().optional(),
    entry_date: z.coerce.date()
  })
});
