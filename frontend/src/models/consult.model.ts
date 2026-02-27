export interface TriageData {
    specialization: string
    urgency: string
}

export interface Doctor {
    id: string
    name: string
    specialization: string
    experience: number | null
    hospital: string
    chamber: string
    helpline: string
    address: string
    mapsLink: string
    rating: number
}

export type ConsultationStep = 'input' | 'result'

export interface ConsultState {
    step: ConsultationStep
    isLoading: boolean
    triageData: TriageData | null
    doctors: Doctor[]
    error: string | null
    userSymptoms: string
}
