import { Request, Response } from 'express'
import { searchHospitals, getHospitalDetail } from '../models/hospital.model.js'

export async function searchHospitalsController(req: Request, res: Response) {
  const query = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  if (query.length < 2) {
    return res.json([])
  }

  try {
    const results = await searchHospitals(query)
    return res.json(results)
  } catch (error) {
    console.error('Hospital search error:', error)
    return res.status(500).json({ error: 'Failed to search hospitals.' })
  }
}

export async function getHospitalDetailController(req: Request, res: Response) {
  const hospitalName = req.params.name
  if (!hospitalName) {
    return res.status(400).json({ error: 'Hospital name is required.' })
  }

  try {
    const detail = await getHospitalDetail(hospitalName)
    if (!detail) {
      return res.status(404).json({ error: 'Hospital not found.' })
    }
    return res.json(detail)
  } catch (error) {
    console.error('Hospital detail error:', error)
    return res.status(500).json({ error: 'Failed to fetch hospital details.' })
  }
}
