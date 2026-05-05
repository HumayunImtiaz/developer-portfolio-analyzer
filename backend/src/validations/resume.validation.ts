import { z } from 'zod';

export const analyzeResumeSchema = z.object({
  body: z.object({
    jobDescription: z.string().max(2000, 'Job description must be at most 2000 characters').optional(),
  }),
});
