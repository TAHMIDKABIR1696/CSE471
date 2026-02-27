import { Request, Response } from 'express'
import { findRecommendedDoctors, getAvailableAreas, getAvailableSpecializations } from '../models/doctor.model.js'

export async function getDoctorsController(req: Request, res: Response) {
  const specializationQuery =
    typeof req.query.specialization === 'string' ? req.query.specialization.toUpperCase() : undefined
  const areaQuery =
    typeof req.query.area === 'string' && req.query.area.trim().length > 0 ? req.query.area.trim() : undefined
  const limitQuery = typeof req.query.limit === 'string' ? Number(req.query.limit) : undefined
  const limit = limitQuery && Number.isFinite(limitQuery) ? Math.max(1, Math.floor(limitQuery)) : undefined

  const minExpRaw = typeof req.query.minExperience === 'string' ? Number(req.query.minExperience) : undefined
  const maxExpRaw = typeof req.query.maxExperience === 'string' ? Number(req.query.maxExperience) : undefined
  const minExperience = minExpRaw != null && Number.isFinite(minExpRaw) ? Math.max(0, Math.floor(minExpRaw)) : undefined
  const maxExperience = maxExpRaw != null && Number.isFinite(maxExpRaw) ? Math.max(0, Math.floor(maxExpRaw)) : undefined

  try {
    const doctors = await findRecommendedDoctors({
      specialization: specializationQuery,
      area: areaQuery,
      minExperience,
      maxExperience,
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

export async function getSpecializationsController(_req: Request, res: Response) {
  try {
    const specializations = await getAvailableSpecializations()
    return res.json(specializations)
  } catch (error) {
    console.error('Specializations error:', error)
    return res.status(500).json({
      error: 'Failed to fetch specializations.'
    })
  }
}
