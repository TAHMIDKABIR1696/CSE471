import { Request, Response } from 'express'
import { findRecommendedDoctors } from '../models/doctor.model.js'
import { allowedSpecializations, Specialization } from '../types/triage.types.js'

export async function getDoctorsController(req: Request, res: Response) {
  const specializationQuery =
    typeof req.query.specialization === 'string' ? req.query.specialization.toUpperCase() : undefined
  const limitQuery = typeof req.query.limit === 'string' ? Number(req.query.limit) : 12
  const limit = Number.isFinite(limitQuery) ? Math.min(50, Math.max(1, Math.floor(limitQuery))) : 12

  if (specializationQuery && !allowedSpecializations.includes(specializationQuery as Specialization)) {
    return res.status(400).json({
      error: 'Invalid specialization value.'
    })
  }

  try {
    const doctors = await findRecommendedDoctors({
      specialization: specializationQuery as Specialization | undefined,
      limit
    })

    return res.json(doctors)
  } catch (error) {
    console.error('Doctors error:', error)
    return res.status(500).json({
      error: 'Failed to fetch doctors.'
    })
  }
}
