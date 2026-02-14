import { useState } from 'react'
import { ConsultState } from '../models/consult.model'
import { getDoctorsBySpecialization } from '../services/doctors.service'
import { classifySymptoms } from '../services/triage.service'

const initialState: ConsultState = {
    step: 'input',
    isLoading: false,
    triageData: null,
    doctors: [],
    error: null,
    userSymptoms: ''
}

export function useConsultController() {
    const [state, setState] = useState<ConsultState>(initialState)

    const handleSubmit = async (symptoms: string) => {
        setState((prev) => ({
            ...prev,
            isLoading: true,
            error: null,
            userSymptoms: symptoms
        }))

        try {
            const triageData = await classifySymptoms(symptoms)
            const doctors = await getDoctorsBySpecialization(triageData.specialization)

            setState((prev) => ({
                ...prev,
                isLoading: false,
                triageData,
                doctors,
                step: 'result'
            }))

            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (error) {
            const err = error as Error
            const message =
                err.name === 'TypeError' && err.message === 'Failed to fetch'
                    ? 'Cannot connect to the server. Please make sure the backend is running.'
                    : err.message || 'Something went wrong. Please try again.'

            setState((prev) => ({
                ...prev,
                isLoading: false,
                error: message
            }))
        }
    }

    const handleReset = () => {
        setState(initialState)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const clearError = () => {
        setState((prev) => ({ ...prev, error: null }))
    }

    return {
        state,
        handleSubmit,
        handleReset,
        clearError
    }
}
