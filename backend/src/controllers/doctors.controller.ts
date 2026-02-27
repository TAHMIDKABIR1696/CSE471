import { Request, Response } from 'express'
import { findRecommendedDoctors, getAvailableAreas } from '../models/doctor.model.js'
import { allowedSpecializations, Specialization } from '../types/triage.types.js'

export async function getDoctorsController(req: Request, res: Response) {
  const specializationQuery =
    typeof req.query.specialization === 'string' ? req.query.specialization.toUpperCase() : undefined
  const areaQuery =
    typeof req.query.area === 'string' && req.query.area.trim().length > 0 ? req.query.area.trim() : undefined
  const limitQuery = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined
  const limit = limitQuery && Number.isFinite(limitQuery) ? Math.max(1, Math.floor(limitQuery)) : undefined

  if (specializationQuery && !allowedSpecializations.includes(specializationQuery as Specialization)) {
    return res.status(400).json({
      error: 'Invalid specialization value.'
    })
  }

  try {
    const doctors = await findRecommendedDoctors({
      specialization: specializationQuery as Specialization | undefined,
      area: areaQuery,
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

export async function getLocationsController(_req: Request, res: Response) {
  try {
    const areas = await getAvailableAreas()
    return res.json(areas)
  } catch (error) {
    console.error('Locations error:', error)
    return res.status(500).json({
      error: 'Failed to fetch locations.'
    })
  }
}
