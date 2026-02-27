import { useState, useEffect } from 'react'
import { ConsultState } from '../models/consult.model'
import { getDoctorsBySpecialization, getLocations } from '../services/doctors.service'
import { classifySymptoms } from '../services/triage.service'
import { ExperienceRange } from '../views/components/DoctorFilters'

const initialState: ConsultState = {
    step: 'input',
    isLoading: false,
    triageData: null,
    doctors: [],
    error: null,
    userSymptoms: '',
    selectedArea: '',
    availableAreas: []
}

export function useConsultController() {
    const [state, setState] = useState<ConsultState>(initialState)
    const [expRange, setExpRange] = useState<ExperienceRange>({ min: undefined, max: undefined })

    useEffect(() => {
        getLocations()
            .then((areas) => setState((prev) => ({ ...prev, availableAreas: areas })))
            .catch(() => {})
    }, [])

    const fetchDoctors = async (specialization: string, area: string, exp: ExperienceRange = expRange) => {
        return getDoctorsBySpecialization(specialization, area || undefined, exp.min, exp.max)
    }

    const handleSubmit = async (symptoms: string) => {
        setState((prev) => ({
            ...prev,
            isLoading: true,
            error: null,
            userSymptoms: symptoms
        }))

        try {
            const triageData = await classifySymptoms(symptoms)
            const doctors = await fetchDoctors(triageData.specialization, state.selectedArea)

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

    const handleAreaChange = async (area: string) => {
        setState((prev) => ({ ...prev, selectedArea: area }))

        if (state.triageData) {
            setState((prev) => ({ ...prev, isLoading: true }))
            try {
                const doctors = await fetchDoctors(state.triageData!.specialization, area)
                setState((prev) => ({ ...prev, doctors, isLoading: false }))
            } catch {
                setState((prev) => ({ ...prev, isLoading: false }))
            }
        }
    }

    const handleExpRangeChange = async (range: ExperienceRange) => {
        setExpRange(range)

        if (state.triageData) {
            setState((prev) => ({ ...prev, isLoading: true }))
            try {
                const doctors = await fetchDoctors(state.triageData!.specialization, state.selectedArea, range)
                setState((prev) => ({ ...prev, doctors, isLoading: false }))
            } catch {
                setState((prev) => ({ ...prev, isLoading: false }))
            }
        }
    }

    const handleReset = () => {
        setState((prev) => ({ ...initialState, availableAreas: prev.availableAreas }))
        setExpRange({ min: undefined, max: undefined })
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const clearError = () => {
        setState((prev) => ({ ...prev, error: null }))
    }

    return {
        state,
        expRange,
        handleSubmit,
        handleReset,
        handleAreaChange,
        handleExpRangeChange,
        clearError
    }
}
