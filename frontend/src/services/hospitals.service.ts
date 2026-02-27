import { requestJson } from './http.client'

export interface HospitalSummary {
    hospital: string
    doctorCount: number
    branchCount: number
    branches: string[]
    specializations: string[]
}

export interface HospitalDoctorInfo {
    id: string
    name: string
    experience: number | null
    degrees: string[]
    rating: number
    chamber: string
    helpline: string
}

export interface BranchDetail {
    chamber: string
    address: string
    specializations: {
        name: string
        doctors: HospitalDoctorInfo[]
    }[]
}

export interface HospitalDetail {
    hospital: string
    totalDoctors: number
    branches: BranchDetail[]
}

export async function searchHospitals(query: string): Promise<HospitalSummary[]> {
    return requestJson<HospitalSummary[]>(
        `/api/hospitals/search?q=${encodeURIComponent(query)}`,
        { method: 'GET' },
        'Failed to search hospitals.'
    )
}

export async function getHospitalDetail(hospitalName: string): Promise<HospitalDetail> {
    return requestJson<HospitalDetail>(
        `/api/hospitals/${encodeURIComponent(hospitalName)}`,
        { method: 'GET' },
        'Failed to fetch hospital details.'
    )
}
