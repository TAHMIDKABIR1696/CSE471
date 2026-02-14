import { Request, Response } from 'express'
import { classifySymptoms } from '../services/triage.service.js'
import { triageRequestSchema } from '../validators/triage.validator.js'

export async function triageController(req: Request, res: Response) {
  const parseResult = triageRequestSchema.safeParse(req.body)
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Invalid request payload.',
      issues: parseResult.error.issues.map((issue) => issue.message)
    })
  }

  try {
    const result = await classifySymptoms(parseResult.data.symptoms)
    return res.json(result)
  } catch (error) {
    console.error('Triage error:', error)
    return res.status(500).json({
      error: 'Failed to analyze symptoms. Please try again.'
    })
  }
}
