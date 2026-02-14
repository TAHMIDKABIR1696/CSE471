import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import { prisma } from '../src/config/database.js'
import { allowedSpecializations, Specialization } from '../src/types/triage.types.js'

type CsvRow = Record<string, string | undefined>

type CliOptions = {
  filePath: string
  truncate: boolean
  onlyDhaka: boolean
}

type DoctorImport = {
  name: string
  specialization: Specialization
  hospital: string
  chamber: string
  helpline: string
  address: string
  mapsLink: string
  rating: number
}

function getArgValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag)
  if (index === -1) return undefined
  return process.argv[index + 1]
}

function parseArgs(): CliOptions {
  const fileArg = getArgValue('--file')
  const truncate = process.argv.includes('--truncate')
  const onlyDhaka = process.argv.includes('--only-dhaka')

  const filePath = fileArg
    ? path.resolve(process.cwd(), fileArg)
    : path.resolve(process.cwd(), 'data', 'doctors_processed_data.csv')

  return { filePath, truncate, onlyDhaka }
}

function pick(row: CsvRow, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = row[key]
    if (value && value.trim().length > 0) {
      return value.trim()
    }
  }
  return undefined
}

function splitChamber(value: string): { hospital: string; chamber: string } {
  const parts = value.split('|').map((part) => part.trim()).filter(Boolean)
  if (parts.length >= 2) {
    return { hospital: parts[0], chamber: parts.slice(1).join(' | ') }
  }
  return { hospital: value, chamber: value }
}

function mapSpecialization(raw: string | undefined): Specialization {
  if (!raw) return 'GENERAL_PHYSICIAN'
  const s = raw.toLowerCase()

  if (s.includes('cardio')) return 'CARDIOLOGIST'
  if (s.includes('neuro')) return 'NEUROLOGIST'
  if (s.includes('derma') || s.includes('skin')) return 'DERMATOLOGIST'
  if (s.includes('ortho') || s.includes('bone') || s.includes('joint')) return 'ORTHOPEDIC'
  if (s.includes('gastro') || s.includes('liver') || s.includes('hepat')) return 'GASTROENTEROLOGIST'
  if (s.includes('pedia') || s.includes('child')) return 'PEDIATRICIAN'
  if (s.includes('psych') || s.includes('mental')) return 'PSYCHIATRIST'
  if (s.includes('general') || s.includes('medicine')) return 'GENERAL_PHYSICIAN'

  return 'GENERAL_PHYSICIAN'
}

function parseExperience(value: string | undefined): number | null {
  if (!value) return null
  const num = Number(value.replace(/[^0-9.]/g, ''))
  return Number.isFinite(num) ? num : null
}

function deriveRating(experience: number | null): number {
  if (experience === null) return 4.0
  const normalized = Math.min(20, Math.max(0, experience))
  const rating = 3.0 + normalized / 10
  return Math.round(Math.min(5, rating) * 10) / 10
}

function buildAddress(row: CsvRow): string {
  const address = pick(row, ['Address', 'Location'])
  if (address) return address

  const parts = [
    pick(row, ['Upazila']),
    pick(row, ['District']),
    pick(row, ['Division'])
  ].filter(Boolean) as string[]

  return parts.length > 0 ? parts.join(', ') : 'Dhaka'
}

function buildDoctor(row: CsvRow): DoctorImport | null {
  const name = pick(row, ['Doctor Name', 'Provider'])
  if (!name) return null

  const rawSpecialization = pick(row, ['Speciality', 'ProfessionalDis', 'Post'])
  const specialization = mapSpecialization(rawSpecialization)

  const chamberRaw = pick(row, ['Chamber'])
  const facilityRaw = pick(row, ['facility'])
  const chamberData = chamberRaw
    ? splitChamber(chamberRaw)
    : facilityRaw
      ? { hospital: facilityRaw, chamber: facilityRaw }
      : { hospital: 'N/A', chamber: 'N/A' }

  const address = buildAddress(row)
  const helpline = pick(row, ['ContactNo']) || 'N/A'
  const experience = parseExperience(pick(row, ['Experience']))
  const rating = deriveRating(experience)

  const mapsQuery = encodeURIComponent(address || chamberData.chamber || chamberData.hospital)
  const mapsLink = `https://maps.google.com/?q=${mapsQuery}`

  return {
    name,
    specialization,
    hospital: chamberData.hospital,
    chamber: chamberData.chamber,
    helpline,
    address,
    mapsLink,
    rating
  }
}

async function main() {
  const { filePath, truncate, onlyDhaka } = parseArgs()

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`)
    process.exit(1)
  }

  const raw = fs.readFileSync(filePath, 'utf8')
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_quotes: true
  }) as CsvRow[]

  let doctors = records.map(buildDoctor).filter((doctor): doctor is DoctorImport => doctor !== null)

  if (onlyDhaka) {
    doctors = doctors.filter((doctor) => doctor.address.toLowerCase().includes('dhaka'))
  }

  const invalid = doctors.filter((doctor) => !allowedSpecializations.includes(doctor.specialization))
  if (invalid.length > 0) {
    console.warn(`Found ${invalid.length} doctors with invalid specialization; defaulted to GENERAL_PHYSICIAN.`)
  }

  if (truncate) {
    await prisma.doctor.deleteMany()
  }

  const chunkSize = 500
  for (let i = 0; i < doctors.length; i += chunkSize) {
    const chunk = doctors.slice(i, i + chunkSize)
    await prisma.doctor.createMany({ data: chunk })
  }

  console.log(`Imported ${doctors.length} doctors from ${path.basename(filePath)}.`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
