export interface TriageData {
    specialization: string
    urgency: string
}

export interface Doctor {
    id: string
    name: string
    specialization: string
    experience: number | null
    degrees: string[]
    concentrations: string[]
    hospital: string
    chamber: string
    helpline: string
    address: string
    mapsLink: string
    city: string
    rating: number
    credibilityScore: number
}

export type ConsultationStep = 'input' | 'result'

export interface ConsultState {
    step: ConsultationStep
    isLoading: boolean
    triageData: TriageData | null
    doctors: Doctor[]
    error: string | null
    userSymptoms: string
    selectedArea: string
    availableAreas: string[]
}
