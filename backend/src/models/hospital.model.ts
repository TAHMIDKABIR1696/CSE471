import { prisma } from '../config/database.js'

export interface HospitalSummary {
  hospital: string
  doctorCount: number
  branchCount: number
  branches: string[]
  specializations: string[]
}

export interface BranchDetail {
  chamber: string
  address: string
  specializations: {
    name: string
    doctors: {
      id: string
      name: string
      experience: number | null
      degrees: string[]
      rating: number
      chamber: string
      helpline: string
    }[]
  }[]
}

export interface HospitalDetail {
  hospital: string
  totalDoctors: number
  branches: BranchDetail[]
}

export async function searchHospitals(query: string): Promise<HospitalSummary[]> {
  const doctors = await prisma.doctor.findMany({
    where: {
      hospital: { contains: query, mode: 'insensitive' }
    },
    select: { hospital: true, specialization: true, chamber: true, address: true }
  })

  const hospitalMap = new Map<string, { specs: Set<string>; branches: Set<string>; count: number }>()

  for (const doc of doctors) {
    const h = doc.hospital
    if (!hospitalMap.has(h)) hospitalMap.set(h, { specs: new Set(), branches: new Set(), count: 0 })
    const entry = hospitalMap.get(h)!
    entry.specs.add(doc.specialization)
    entry.branches.add(doc.chamber || doc.address || 'Main')
    entry.count++
  }

  return [...hospitalMap.entries()]
    .map(([hospital, data]) => ({
      hospital,
      doctorCount: data.count,
      branchCount: data.branches.size,
      branches: [...data.branches].sort(),
      specializations: [...data.specs].sort()
    }))
    .sort((a, b) => b.doctorCount - a.doctorCount)
}

export async function getHospitalDetail(hospitalName: string): Promise<HospitalDetail | null> {
  const doctors = await prisma.doctor.findMany({
    where: { hospital: hospitalName },
    select: {
      id: true,
      name: true,
      specialization: true,
      experience: true,
      degrees: true,
      rating: true,
      chamber: true,
      address: true,
      helpline: true
    },
    orderBy: [{ rating: 'desc' }, { name: 'asc' }]
  })

  if (doctors.length === 0) return null

  // Group by branch (chamber + address), then by specialization
  const branchMap = new Map<string, typeof doctors>()
  for (const doc of doctors) {
    const branchKey = doc.chamber || doc.address || 'Main'
    if (!branchMap.has(branchKey)) branchMap.set(branchKey, [])
    branchMap.get(branchKey)!.push(doc)
  }

  const branches: BranchDetail[] = [...branchMap.entries()]
    .sort((a, b) => b[1].length - a[1].length)
    .map(([chamber, branchDocs]) => {
      const specMap = new Map<string, typeof doctors>()
      for (const doc of branchDocs) {
        if (!specMap.has(doc.specialization)) specMap.set(doc.specialization, [])
        specMap.get(doc.specialization)!.push(doc)
      }
      return {
        chamber,
        address: branchDocs[0]?.address || '',
        specializations: [...specMap.entries()]
          .map(([name, docs]) => ({ name, doctors: docs }))
          .sort((a, b) => b.doctors.length - a.doctors.length)
      }
    })

  return {
    hospital: hospitalName,
    totalDoctors: doctors.length,
    branches
  }
}
