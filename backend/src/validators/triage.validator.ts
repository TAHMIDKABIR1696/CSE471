import { z } from 'zod'

export const triageRequestSchema = z.object({
  symptoms: z.string().min(3, 'Symptoms must be at least 3 characters.')
})

export type TriageRequest = z.infer<typeof triageRequestSchema>
