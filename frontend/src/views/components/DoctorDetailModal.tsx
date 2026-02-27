import { useEffect } from 'react'
import { Doctor } from '../../models/consult.model'
import {
    X, User, Star, Building2, MapPin, Phone, Clock,
    Navigation, Award, Activity, Stethoscope
} from 'lucide-react'

interface DoctorDetailModalProps {
    doctor: Doctor
    onClose: () => void
}

function formatSpecialization(spec: string): string {
    return spec
        .split('_')
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(' ')
}

function getSpecIcon(spec: string) {
    const s = spec.toUpperCase()
    if (s.includes('CARDIO')) return '❤️'
    if (s.includes('NEURO')) return '🧠'
    if (s.includes('DERMA')) return '🩹'
    if (s.includes('ORTHO')) return '🦴'
    if (s.includes('GASTRO')) return '🫁'
    if (s.includes('PEDIA')) return '👶'
    if (s.includes('PSYCH')) return '🧘'
    return '🩺'
}

function getRatingLabel(rating: number): string {
    if (rating >= 4.8) return 'Excellent'
    if (rating >= 4.5) return 'Very Good'
    if (rating >= 4.0) return 'Good'
    if (rating >= 3.5) return 'Above Average'
    return 'Average'
}

function getCredibilityLabel(score: number): { label: string; color: string } {
    if (score >= 0.85) return { label: 'Highly Reputed', color: 'text-green-400' }
    if (score >= 0.7) return { label: 'Well Reputed', color: 'text-blue-400' }
    if (score >= 0.5) return { label: 'Reputed', color: 'text-yellow-400' }
    return { label: 'Emerging', color: 'text-gray-400' }
}

export default function DoctorDetailModal({ doctor, onClose }: DoctorDetailModalProps) {
    const credibility = getCredibilityLabel(doctor.credibilityScore)

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', handleEsc)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = ''
        }
    }, [onClose])

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl
                           bg-dark-900 border border-white/10 shadow-2xl shadow-primary-500/10
                           animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative p-6 pb-4 border-b border-white/10">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 border border-white/10
                                   text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-500/30
                                        border border-white/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-8 h-8 text-primary-300" />
                        </div>
                        <div className="pr-8">
                            <h2 className="text-xl font-bold text-white leading-tight">{doctor.name}</h2>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-lg">{getSpecIcon(doctor.specialization)}</span>
                                <span className="text-sm font-medium text-primary-400">
                                    {formatSpecialization(doctor.specialization)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-px bg-white/5">
                    {/* Rating */}
                    <div className="p-4 text-center bg-dark-900">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-lg font-bold text-yellow-300">{doctor.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">{getRatingLabel(doctor.rating)}</p>
                    </div>

                    {/* Experience */}
                    <div className="p-4 text-center bg-dark-900">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Clock className="w-4 h-4 text-accent-400" />
                            <span className="text-lg font-bold text-accent-300">
                                {doctor.experience != null ? doctor.experience : '—'}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">
                            {doctor.experience != null ? 'Years Exp.' : 'Experience N/A'}
                        </p>
                    </div>

                    {/* Credibility */}
                    <div className="p-4 text-center bg-dark-900">
                        <div className="flex items-center justify-center gap-1 mb-1">
                            <Award className="w-4 h-4 text-purple-400" />
                            <span className="text-lg font-bold text-purple-300">
                                {Math.round(doctor.credibilityScore * 100)}%
                            </span>
                        </div>
                        <p className={`text-xs ${credibility.color}`}>{credibility.label}</p>
                    </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                    {/* Specialization */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <Stethoscope className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</p>
                            <p className="text-sm text-white mt-0.5">{formatSpecialization(doctor.specialization)}</p>
                        </div>
                    </div>

                    {/* Hospital */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <Building2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital / Clinic</p>
                            <p className="text-sm text-white mt-0.5">{doctor.hospital}</p>
                        </div>
                    </div>

                    {/* Chamber */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <MapPin className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Chamber Address</p>
                            <p className="text-sm text-white mt-0.5">{doctor.chamber}</p>
                            <p className="text-xs text-gray-400 mt-1">{doctor.address}, {doctor.city}</p>
                        </div>
                    </div>

                    {/* Helpline */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <Phone className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Helpline / Contact</p>
                            <a
                                href={`tel:${doctor.helpline}`}
                                className="text-sm text-primary-400 hover:text-primary-300 transition-colors mt-0.5 inline-block"
                            >
                                {doctor.helpline}
                            </a>
                        </div>
                    </div>

                    {/* Reputation */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <Activity className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Reputation Score</p>
                            <div className="mt-1.5">
                                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500"
                                        style={{ width: `${Math.round(doctor.credibilityScore * 100)}%` }}
                                    />
                                </div>
                                <p className={`text-xs mt-1 ${credibility.color}`}>
                                    {Math.round(doctor.credibilityScore * 100)}% — {credibility.label}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-2 flex flex-col gap-3">
                    <a
                        href={doctor.mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                   bg-gradient-to-r from-accent-600 to-accent-500 text-white font-semibold
                                   hover:from-accent-500 hover:to-accent-400 transition-all text-sm
                                   shadow-lg shadow-accent-500/20"
                    >
                        <Navigation className="w-4 h-4" />
                        Get Directions on Google Maps
                    </a>

                    {doctor.helpline !== 'N/A' && (
                        <a
                            href={`tel:${doctor.helpline}`}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                       bg-primary-500/15 border border-primary-500/20 text-primary-300
                                       hover:bg-primary-500/25 hover:border-primary-500/30
                                       transition-all text-sm font-medium"
                        >
                            <Phone className="w-4 h-4" />
                            Call Helpline
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}
