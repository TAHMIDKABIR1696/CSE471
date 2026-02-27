import { Doctor } from '../models/consult.model'
import { requestJson } from './http.client'

export async function getDoctorsBySpecialization(specialization: string, area?: string): Promise<Doctor[]> {
    let query = `specialization=${encodeURIComponent(specialization)}`
    if (area) {
        query += `&area=${encodeURIComponent(area)}`
    }
    return requestJson<Doctor[]>(
        `/api/doctors?${query}`,
        { method: 'GET' },
        'Failed to fetch doctors.'
    )
}

export async function getLocations(): Promise<string[]> {
    return requestJson<string[]>(
        '/api/locations',
        { method: 'GET' },
        'Failed to fetch locations.'
    )
}
