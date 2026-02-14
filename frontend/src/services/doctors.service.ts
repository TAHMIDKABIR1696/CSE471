import { Doctor } from '../models/consult.model'
import { requestJson } from './http.client'

export async function getDoctorsBySpecialization(specialization: string, limit = 12): Promise<Doctor[]> {
    const query = `specialization=${encodeURIComponent(specialization)}&limit=${limit}`
    return requestJson<Doctor[]>(
        `/api/doctors?${query}`,
        { method: 'GET' },
        'Failed to fetch doctors.'
    )
}
