import { AlertTriangle, AlertCircle, Info, CheckCircle, Stethoscope } from 'lucide-react'

interface TriageResultProps {
    specialization: string
    urgency: string
}

const urgencyConfig: Record<string, { label: string; class: string; icon: typeof AlertTriangle; description: string }> = {
    LOW: {
        label: 'Low Urgency',
        class: 'urgency-low',
        icon: CheckCircle,
        description: 'Mild, non-urgent symptoms. You may schedule a routine appointment at your convenience.',
    },
    MEDIUM: {
        label: 'Medium Urgency',
        class: 'urgency-medium',
        icon: Info,
        description: 'Persistent or worsening symptoms. We recommend consulting a doctor soon.',
    },
    HIGH: {
        label: 'High Urgency',
        class: 'urgency-high',
        icon: AlertCircle,
        description: 'Serious symptoms requiring prompt medical consultation. Please see a doctor as soon as possible.',
    },
    EMERGENCY: {
        label: '⚠ EMERGENCY',
        class: 'urgency-emergency',
        icon: AlertTriangle,
        description: 'Potentially life-threatening symptoms! Please call 999 or visit the nearest emergency department immediately.',
    },
}

const specializationLabels: Record<string, string> = {
    CARDIOLOGIST: 'Cardiologist (Heart Specialist)',
    NEUROLOGIST: 'Neurologist (Brain & Nerve Specialist)',
    DERMATOLOGIST: 'Dermatologist (Skin Specialist)',
    ORTHOPEDIC: 'Orthopedic (Bone & Joint Specialist)',
    GASTROENTEROLOGIST: 'Gastroenterologist (Digestive System)',
    PEDIATRICIAN: 'Pediatrician (Child Specialist)',
    PSYCHIATRIST: 'Psychiatrist (Mental Health Specialist)',
    GENERAL_PHYSICIAN: 'General Physician',
}

export default function TriageResult({ specialization, urgency }: TriageResultProps) {
    const urgencyInfo = urgencyConfig[urgency] || urgencyConfig.MEDIUM
    const UrgencyIcon = urgencyInfo.icon
    const specLabel = specializationLabels[specialization] || specialization

    return (
        <div className="w-full max-w-3xl mx-auto animate-slide-up">
            <div className="glass-card p-6 sm:p-8">
                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-primary-400" />
                    Triage Result
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Specialization */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Recommended Specialty</p>
                        <div className="spec-badge">
                            <Stethoscope className="w-4 h-4" />
                            {specLabel}
                        </div>
                    </div>

                    {/* Urgency */}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Urgency Level</p>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${urgencyInfo.class}`}>
                            <UrgencyIcon className="w-4 h-4" />
                            {urgencyInfo.label}
                        </div>
                    </div>
                </div>

                {/* Urgency Description */}
                <div className={`mt-4 p-4 rounded-xl text-sm ${urgency === 'EMERGENCY'
                        ? 'bg-red-500/10 border border-red-500/20 text-red-300'
                        : 'bg-white/5 border border-white/5 text-gray-400'
                    }`}>
                    <div className="flex items-start gap-3">
                        <UrgencyIcon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${urgency === 'EMERGENCY' ? 'text-red-400' : 'text-gray-500'
                            }`} />
                        <p>{urgencyInfo.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
