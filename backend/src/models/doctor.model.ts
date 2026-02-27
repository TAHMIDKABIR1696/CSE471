import { prisma } from '../config/database.js'
import { Specialization } from '../types/triage.types.js'

type FindDoctorsParams = {
  specialization?: Specialization
  area?: string
  limit?: number
}

const KNOWN_AREAS = [
  'Dhanmondi', 'Gulshan', 'Banani', 'Mirpur', 'Uttara',
  'Mohakhali', 'Motijheel', 'Panthapath', 'Shyamoli',
  'Bashundhara', 'Farmgate', 'Mohammadpur', 'Tejgaon',
  'Lalmatia', 'Shahbag', 'Green Road', 'Badda',
  'Rampura', 'Khilgaon', 'Malibagh', 'Mogbazar'
] as const

export async function findRecommendedDoctors({ specialization, area, limit }: FindDoctorsParams) {
  const doctors = await prisma.doctor.findMany({
    where: specialization ? { specialization } : {},
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
