export const allowedSpecializations = [
  'CARDIOLOGIST',
  'NEUROLOGIST',
  'DERMATOLOGIST',
  'ORTHOPEDIC',
  'GASTROENTEROLOGIST',
  'PEDIATRICIAN',
  'PSYCHIATRIST',
  'GENERAL_PHYSICIAN'
] as const

export const allowedUrgencies = ['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'] as const

export type Specialization = (typeof allowedSpecializations)[number]
export type Urgency = (typeof allowedUrgencies)[number]

export type TriageResult = {
  specialization: Specialization
  urgency: Urgency
}
