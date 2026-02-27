import { useState, useEffect } from 'react'
import { Stethoscope, Users, Loader2, Search } from 'lucide-react'
import { Doctor } from '../../models/consult.model'
import { searchDoctors, getSpecializations, getLocations } from '../../services/doctors.service'
import DoctorCard from './DoctorCard'
import DoctorDetailModal from './DoctorDetailModal'
import DoctorFilters from './DoctorFilters'
import { ExperienceRange } from './DoctorFilters'

const SPEC_ICONS: Record<string, string> = {
    CARDIOLOGIST: '❤️',
    CARDIAC_SURGEON: '❤️',
    CARDIOTHORACIC_SURGEON: '❤️',
    CARDIOTHORACIC_AND_VASCULAR_SURGEON: '❤️',
    INTERVENTIONAL_CARDIOLOGIST: '❤️',
    PEDIATRIC_CARDIOLOGIST: '❤️',
    NEUROLOGIST: '🧠',
    NEUROSURGEON: '🧠',
    NEUROMEDICINE_SPECIALIST: '🧠',
    NEURO_PHYSICIAN: '🧠',
    PEDIATRIC_NEUROLOGIST: '🧠',
    PEDIATRIC_NEUROSURGEON: '🧠',
    DERMATOLOGIST: '🩹',
    COSMETOLOGIST: '🩹',
    LASER_DERMATOSURGEON: '🩹',
    ALLERGY_SKIN_VD: '🩹',
    VENEREOLOGIST: '🩹',
    ORTHOPEDIC: '🦴',
    ORTHOPEDIST: '🦴',
    ORTHOPEDIC_SURGEON: '🦴',
    SPINE_SURGEON: '🦴',
    TRAUMA_SURGEON: '🦴',
    GASTROENTEROLOGIST: '🫁',
    HEPATOLOGIST: '🫁',
    PEDIATRIC_GASTROENTEROLOGIST: '🫁',
    PEDIATRICIAN: '👶',
    PEDIATRIC_SURGEON: '👶',
    PEDIATRICIAN_AND_NEONATOLOGIST: '👶',
    NEONATOLOGIST: '👶',
    PEDIATRIC_HEMATOLOGIST: '👶',
    PEDIATRIC_HEMATOLOGIST_AND_ONCOLOGIST: '👶',
    PEDIATRIC_NEPHROLOGIST: '👶',
    PEDIATRIC_PULMONOLOGIST: '👶',
    PSYCHIATRIST: '🧘',
    PSYCHOLOGIST: '🧘',
    GENERAL_PHYSICIAN: '🩺',
    MEDICINE_SPECIALIST: '🩺',
    FAMILY_MEDICINE_SPECIALIST: '🩺',
    INTERNAL_MEDICINE: '🩺',
    INTERNAL_MEDICINE_SPECIALIST: '🩺',
    GENERAL_SURGEON: '🔪',
    SURGEON: '🔪',
    LAPAROSCOPIC_SURGEON: '🔪',
    LAPAROSCOPIST: '🔪',
    PLASTIC_SURGEON: '🔪',
    COLORECTAL_SURGEON: '🔪',
    COLORECTAL_AND_LAPAROSCOPIC_SURGEON: '🔪',
    COLORECTAL_AND_LAPAROSCOPIC_SURGERY: '🔪',
    HEPATOBILIARY_SURGEON: '🔪',
    VASCULAR_SURGEON: '🔪',
    GYNECOLOGIST_AND_OBSTETRICIAN: '👩‍⚕️',
    GYNECOLOGISTS: '👩‍⚕️',
    GYNECOLOGIC_ONCOLOGIST: '👩‍⚕️',
    OBSTETRICIAN: '👩‍⚕️',
    INFERTILITY_SPECIALIST: '👩‍⚕️',
    DIABETES_SPECIALIST: '💉',
    DIABETOLOGIST: '💉',
    ENDOCRINOLOGIST: '💉',
    DENTIST: '🦷',
    MAXILLOFACIAL_SURGEON: '🦷',
    MAXILLOFACIAL_AND_DENTAL_SURGEON: '🦷',
    OPHTHALMOLOGIST: '👁️',
    OTOLARYNGOLOGISTS_ENT: '👂',
    PULMONOLOGIST: '🫁',
    PULMONARY_MEDICINE_SPECIALIST: '🫁',
    RESPIRATORY_SPECIALIST: '🫁',
    CHEST_SPECIALIST: '🫁',
    NEPHROLOGIST: '🫘',
    UROLOGIST: '🫘',
    ONCOLOGIST: '🎗️',
    HEMATOLOGIST: '🩸',
    RHEUMATOLOGIST: '🦴',
    IMMUNOLOGIST: '🛡️',
    PHYSICAL_MEDICINE: '🏃',
    PHYSIOTHERAPIST: '🏃',
    REHABILITATION_SPECIALIST: '🏃',
    PAIN_MANAGEMENT_SPECIALIST: '💊',
    NUTRITIONIST: '🥗',
    CLINICAL_NUTRITIONIST: '🥗',
    DIETICIAN: '🥗',
    CRITICAL_CARE_SPECIALIST: '🚑',
    CRITICAL_CARE_MEDICINE_SPECIALIST: '🚑',
    ANESTHESIOLOGIST: '💤',
    RADIOLOGIST: '📡',
    NUCLEOLOGISTS: '📡',
    PATHOLOGIST: '🔬',
    EPIDEMIOLOGIST: '🔬',
    SONOLOGIST: '📡',
    SEXUAL_MEDICINE_SPECIALIST: '💊',
    THORACIC_SURGEON: '❤️',
    TRANSFUSION_MEDICINE_SPECIALIST: '🩸'
}

function formatSpecLabel(spec: string): string {
    return spec
        .split('_')
        .map((w) => {
            if (w === 'AND' || w === 'ENT' || w === 'VD') return w
            return w.charAt(0) + w.slice(1).toLowerCase()
        })
        .join(' ')
}

export default function BrowseDoctors() {
    const [specializations, setSpecializations] = useState<string[]>([])
    const [selectedSpec, setSelectedSpec] = useState<string>('')
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [areas, setAreas] = useState<string[]>([])
    const [selectedArea, setSelectedArea] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [expRange, setExpRange] = useState<ExperienceRange>({ min: undefined, max: undefined })

    useEffect(() => {
        getSpecializations().then(setSpecializations).catch(() => {})
        getLocations().then(setAreas).catch(() => {})
    }, [])

    const fetchDoctors = async (spec: string, area: string, exp: ExperienceRange = expRange) => {
        setIsLoading(true)
        try {
            const result = await searchDoctors({
                specialization: spec || undefined,
                area: area || undefined,
                minExperience: exp.min,
                maxExperience: exp.max
            })
            setDoctors(result)
        } catch {
            setDoctors([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleSpecSelect = (spec: string) => {
        const newSpec = spec === selectedSpec ? '' : spec
        setSelectedSpec(newSpec)
        if (newSpec) {
            fetchDoctors(newSpec, selectedArea)
        } else {
            setDoctors([])
        }
    }

    const handleAreaChange = (area: string) => {
        setSelectedArea(area)
        if (selectedSpec) {
            fetchDoctors(selectedSpec, area)
        }
    }

    const handleExpRangeChange = (range: ExperienceRange) => {
        setExpRange(range)
        if (selectedSpec) {
            fetchDoctors(selectedSpec, selectedArea, range)
        }
    }

    const filteredSpecs = searchTerm
        ? specializations.filter((s) => formatSpecLabel(s).toLowerCase().includes(searchTerm.toLowerCase()))
        : specializations

    return (
        <section id="browse-doctors" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20
                            text-accent-300 text-sm font-medium mb-4">
                        <Users className="w-4 h-4" />
                        Browse Doctors
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Find Doctors by <span className="gradient-text">Specialization</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        Select a specialization to browse available doctors directly — no need to describe symptoms.
                    </p>
                </div>

                {/* Search Specializations */}
                {specializations.length > 10 && (
                    <div className="max-w-md mx-auto mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search specializations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white
                                           placeholder-gray-500 focus:outline-none focus:border-primary-500/40 transition-colors"
                            />
                        </div>
                    </div>
                )}

                {/* Specialization Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8 max-h-[400px] overflow-y-auto pr-1">
                    {filteredSpecs.map((spec) => {
                        const icon = SPEC_ICONS[spec] || '🩺'
                        const label = formatSpecLabel(spec)
                        const isActive = selectedSpec === spec
                        return (
                            <button
                                key={spec}
                                onClick={() => handleSpecSelect(spec)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all
                                    ${isActive
                                        ? 'bg-primary-500/20 border-primary-500/40 shadow-lg shadow-primary-500/10'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                <span className="text-2xl">{icon}</span>
                                <span className={`text-xs font-medium text-center leading-tight ${isActive ? 'text-primary-300' : 'text-gray-400'}`}>
                                    {label}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {filteredSpecs.length === 0 && searchTerm && (
                    <p className="text-center text-gray-500 text-sm mb-8">
                        No specializations match "{searchTerm}"
                    </p>
                )}

                {/* Filters & Results */}
                {selectedSpec && (
                    <div className="space-y-6 animate-slide-up">
                        {/* Filters */}
                        <DoctorFilters
                            areas={areas}
                            selectedArea={selectedArea}
                            onAreaChange={handleAreaChange}
                            selectedExpRange={expRange}
                            onExpRangeChange={handleExpRangeChange}
                            disabled={isLoading}
                        />

                        {/* Loading */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                                <span className="ml-2 text-sm text-gray-400">Finding doctors…</span>
                            </div>
                        )}

                        {/* Results */}
                        {!isLoading && doctors.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Stethoscope className="w-5 h-5 text-primary-400" />
                                    {formatSpecLabel(selectedSpec)} Doctors
                                    <span className="text-sm font-normal text-gray-500">
                                        ({doctors.length} found)
                                    </span>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {doctors.map((doctor, index) => (
                                        <DoctorCard
                                            key={doctor.id}
                                            doctor={doctor}
                                            index={index}
                                            onSelect={setSelectedDoctor}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No Results */}
                        {!isLoading && doctors.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500 text-sm">
                                    No doctors found for the selected filters. Try adjusting your criteria.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Doctor Detail Modal */}
            {selectedDoctor && (
                <DoctorDetailModal
                    doctor={selectedDoctor}
                    onClose={() => setSelectedDoctor(null)}
                />
            )}
        </section>
    )
}
