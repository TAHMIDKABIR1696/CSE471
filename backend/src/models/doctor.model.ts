import { prisma } from '../config/database.js'
import { Specialization } from '../types/triage.types.js'

type FindDoctorsParams = {
  specialization?: string
  area?: string
  minExperience?: number
  maxExperience?: number
  limit?: number
}

const KNOWN_AREAS = [
  'Dhanmondi', 'Gulshan', 'Banani', 'Mirpur', 'Uttara',
  'Mohakhali', 'Motijheel', 'Panthapath', 'Shyamoli',
  'Bashundhara', 'Farmgate', 'Mohammadpur', 'Tejgaon',
  'Lalmatia', 'Shahbag', 'Green Road', 'Badda',
  'Rampura', 'Khilgaon', 'Malibagh', 'Mogbazar'
] as const

export async function findRecommendedDoctors({ specialization, area, minExperience, maxExperience, limit }: FindDoctorsParams) {
  const where: Record<string, unknown> = {}
  if (specialization) where.specialization = specialization
  if (minExperience != null || maxExperience != null) {
    const expFilter: Record<string, number> = {}
    if (minExperience != null) expFilter.gte = minExperience
    if (maxExperience != null) expFilter.lte = maxExperience
    where.experience = expFilter
  }

  const doctors = await prisma.doctor.findMany({
    where,
    orderBy: [{ credibilityScore: 'desc' }, { rating: 'desc' }, { name: 'asc' }]
  })

  let filtered = doctors.filter((doctor) => {
    const locationText = `${doctor.address} ${doctor.hospital} ${doctor.chamber}`.toLowerCase()
    return locationText.includes('dhaka')
  })

  if (area) {
    filtered = filtered.filter((doctor) => {
      const locationText = `${doctor.address} ${doctor.hospital} ${doctor.chamber}`.toLowerCase()
      return locationText.includes(area.toLowerCase())
    })
  }

  return limit ? filtered.slice(0, limit) : filtered
}

export async function getAvailableAreas(): Promise<string[]> {
  const doctors = await prisma.doctor.findMany({
    select: { address: true, hospital: true, chamber: true }
  })

  const areaCounts = new Map<string, number>()

  for (const doctor of doctors) {
    const locationText = `${doctor.address} ${doctor.hospital} ${doctor.chamber}`.toLowerCase()
    if (!locationText.includes('dhaka')) continue

    for (const area of KNOWN_AREAS) {
      if (locationText.includes(area.toLowerCase())) {
        areaCounts.set(area, (areaCounts.get(area) || 0) + 1)
      }
    }
  }

  return [...areaCounts.entries()]
    .filter(([, count]) => count >= 1)
    .sort((a, b) => b[1] - a[1])
    .map(([area]) => area)
}

export async function getAvailableSpecializations(): Promise<string[]> {
  const doctors = await prisma.doctor.findMany({
    select: { specialization: true },
    distinct: ['specialization'],
    orderBy: { specialization: 'asc' }
  })
  return doctors.map((d) => d.specialization)
}
