import { z } from 'zod';

export const createMedicationSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    dosage: z.string().min(1),
    frequency_hours: z.coerce.number(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date().optional(),
    instructions: z.string().optional()
  })
});

export const updateMedicationSchema = createMedicationSchema.partial();
