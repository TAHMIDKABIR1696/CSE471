import { prisma } from '../config/database.js'
import { Specialization } from '../types/triage.types.js'

type FindDoctorsParams = {
  specialization?: Specialization
  limit: number
}

export async function findRecommendedDoctors({ specialization, limit }: FindDoctorsParams) {
  const doctors = await prisma.doctor.findMany({
    where: specialization ? { specialization } : {},
    orderBy: [{ rating: 'desc' }, { name: 'asc' }]
  })

  const dhakaDoctors = doctors.filter((doctor) => {
    const locationText = `${doctor.address} ${doctor.hospital} ${doctor.chamber}`.toLowerCase()
    return locationText.includes('dhaka')
  })

  return dhakaDoctors.slice(0, limit)
}
