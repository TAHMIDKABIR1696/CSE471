import OpenAI from 'openai'
import { config } from '../config/env.js'
import { TRIAGE_SYSTEM_PROMPT } from '../prompts/triage.prompt.js'
import {
  allowedSpecializations,
  allowedUrgencies,
  TriageResult,
  Specialization,
  Urgency
} from '../types/triage.types.js'

let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI | null {
  if (!config.openaiApiKey) {
    return null
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: config.openaiApiKey })
  }

  return openaiClient
}

function normalizeResult(result: Partial<TriageResult>): TriageResult {
  const specialization = allowedSpecializations.includes(result.specialization as Specialization)
    ? (result.specialization as Specialization)
    : 'GENERAL_PHYSICIAN'

  const urgency = allowedUrgencies.includes(result.urgency as Urgency)
    ? (result.urgency as Urgency)
    : 'MEDIUM'

  return { specialization, urgency }
}

function extractJson(raw: string): string {
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) {
    return ''
  }
  return raw.slice(start, end + 1)
}

async function classifyWithOpenAI(symptoms: string): Promise<TriageResult> {
  const client = getOpenAIClient()
  if (!client) {
    return classifyRuleBased(symptoms)
  }

  const response = await client.chat.completions.create({
    model: config.openaiModel,
    temperature: 0.1,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'medical_triage',
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            specialization: {
              type: 'string',
              enum: [...allowedSpecializations]
            },
            urgency: {
              type: 'string',
              enum: [...allowedUrgencies]
            }
          },
          required: ['specialization', 'urgency']
        }
      }
    },
    messages: [
      { role: 'system', content: TRIAGE_SYSTEM_PROMPT },
      { role: 'user', content: symptoms }
    ]
  } as any)

  const content = Array.isArray(response.choices?.[0]?.message?.content)
    ? response.choices?.[0]?.message?.content
        .map((part: any) => (typeof part?.text === 'string' ? part.text : ''))
        .join('')
    : response.choices?.[0]?.message?.content || ''
  const json = extractJson(content)
  if (!json) {
    return classifyRuleBased(symptoms)
  }

  try {
    const parsed = JSON.parse(json) as Partial<TriageResult>
    return normalizeResult(parsed)
  } catch {
    return classifyRuleBased(symptoms)
  }
}

function classifyRuleBased(symptoms: string): TriageResult {
  const s = symptoms.toLowerCase()

  let urgency: Urgency = 'MEDIUM'
  if (
    s.includes('chest pain') ||
    s.includes('pain in chest') ||
    s.includes('shortness of breath') ||
    s.includes('severe breathing') ||
    s.includes('can\'t breathe') ||
    s.includes('cannot breathe') ||
    s.includes('unconscious') ||
    s.includes('seizure') ||
    s.includes('stroke') ||
    s.includes('face droop') ||
    s.includes('slurred speech') ||
    s.includes('suicidal') ||
    s.includes('bleeding heavily') ||
    s.includes('uncontrolled bleeding')
  ) {
    urgency = 'EMERGENCY'
  } else if (s.includes('severe') || s.includes('intense') || s.includes('worsening')) {
    urgency = 'HIGH'
  } else if (s.includes('mild') || s.includes('slight')) {
    urgency = 'LOW'
  }

  let specialization: Specialization = 'GENERAL_PHYSICIAN'
  if (
    s.includes('heart') ||
    s.includes('chest pain') ||
    s.includes('palpitations') ||
    s.includes('pressure in chest')
  ) {
    specialization = 'CARDIOLOGIST'
  } else if (
    s.includes('stroke') ||
    s.includes('seizure') ||
    s.includes('numbness') ||
    s.includes('weakness') ||
    s.includes('migraine')
  ) {
    specialization = 'NEUROLOGIST'
  } else if (s.includes('rash') || s.includes('skin') || s.includes('itch') || s.includes('acne')) {
    specialization = 'DERMATOLOGIST'
  } else if (
    s.includes('bone') ||
    s.includes('joint') ||
    s.includes('fracture') ||
    s.includes('back pain') ||
    s.includes('sprain')
  ) {
    specialization = 'ORTHOPEDIC'
  } else if (
    s.includes('stomach') ||
    s.includes('abdomen') ||
    s.includes('abdominal') ||
    s.includes('nausea') ||
    s.includes('vomiting') ||
    s.includes('diarrhea')
  ) {
    specialization = 'GASTROENTEROLOGIST'
  } else if (
    s.includes('child') ||
    s.includes('baby') ||
    s.includes('infant') ||
    s.includes('toddler')
  ) {
    specialization = 'PEDIATRICIAN'
  } else if (
    s.includes('anxiety') ||
    s.includes('depression') ||
    s.includes('panic') ||
    s.includes('insomnia')
  ) {
    specialization = 'PSYCHIATRIST'
  }

  return normalizeResult({ specialization, urgency })
}

export async function classifySymptoms(symptoms: string): Promise<TriageResult> {
  if (!symptoms || symptoms.trim().length === 0) {
    return normalizeResult({ specialization: 'GENERAL_PHYSICIAN', urgency: 'MEDIUM' })
  }

  return classifyWithOpenAI(symptoms)
}
