import { Doctor } from '../models/consult.model'
import { requestJson } from './http.client'

export interface DoctorSearchParams {
    specialization?: string
    area?: string
    minExperience?: number
    maxExperience?: number
}

export async function getDoctorsBySpecialization(
    specialization: string,
    area?: string,
    minExperience?: number,
    maxExperience?: number
): Promise<Doctor[]> {
    let query = `specialization=${encodeURIComponent(specialization)}`
    if (area) query += `&area=${encodeURIComponent(area)}`
    if (minExperience != null) query += `&minExperience=${minExperience}`
    if (maxExperience != null) query += `&maxExperience=${maxExperience}`
    return requestJson<Doctor[]>(
        `/api/doctors?${query}`,
        { method: 'GET' },
        'Failed to fetch doctors.'
    )
}

export async function searchDoctors(params: DoctorSearchParams): Promise<Doctor[]> {
    const parts: string[] = []
    if (params.specialization) parts.push(`specialization=${encodeURIComponent(params.specialization)}`)
    if (params.area) parts.push(`area=${encodeURIComponent(params.area)}`)
    if (params.minExperience != null) parts.push(`minExperience=${params.minExperience}`)
    if (params.maxExperience != null) parts.push(`maxExperience=${params.maxExperience}`)
    const query = parts.length > 0 ? `?${parts.join('&')}` : ''
    return requestJson<Doctor[]>(
        `/api/doctors${query}`,
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

export async function getSpecializations(): Promise<string[]> {
    return requestJson<string[]>(
        '/api/specializations',
        { method: 'GET' },
        'Failed to fetch specializations.'
    )
}
