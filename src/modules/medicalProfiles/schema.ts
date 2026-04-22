import { z } from 'zod';

export const updateMedicalProfileSchema = z.object({
  body: z.object({
    allergies: z.string().optional().nullable(),
    chronic_conditions: z.string().optional().nullable(),
    emergency_contact_name: z.string().optional().nullable(),
    emergency_contact_phone: z.string().optional().nullable(),
    emergency_contact_relation: z.string().optional().nullable(),
  })
});
