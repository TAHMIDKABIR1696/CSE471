import { TriageData } from '../models/consult.model'
import { requestJson } from './http.client'

export async function classifySymptoms(symptoms: string): Promise<TriageData> {
    return requestJson<TriageData>(
        '/api/triage',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ symptoms })
        },
        'Failed to analyze symptoms. Please try again.'
    )
}
