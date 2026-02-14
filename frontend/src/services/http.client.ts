const API_BASE = import.meta.env.VITE_API_URL || ''

type ApiErrorPayload = {
    error?: string
}

export async function requestJson<T>(path: string, init: RequestInit, fallbackMessage: string): Promise<T> {
    const response = await fetch(`${API_BASE}${path}`, init)

    if (!response.ok) {
        const errorPayload = (await response.json().catch(() => ({}))) as ApiErrorPayload
        throw new Error(errorPayload.error || fallbackMessage)
    }

    return (await response.json()) as T
}
