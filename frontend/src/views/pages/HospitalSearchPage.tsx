import { useState, useRef, useCallback } from 'react'
import {
    Search, Building2, Users, Stethoscope, ChevronDown, ChevronUp,
    Star, Clock, Phone, MapPin, Loader2, GitBranch
} from 'lucide-react'
import {
    searchHospitals, getHospitalDetail,
    HospitalSummary, HospitalDetail
} from '../../services/hospitals.service'

function formatSpecialization(spec: string): string {
    return spec
        .split('_')
        .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
        .join(' ')
}

export default function HospitalSearchPage() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<HospitalSummary[]>([])
    const [searching, setSearching] = useState(false)
    const [searched, setSearched] = useState(false)
    const [expandedHospital, setExpandedHospital] = useState<string | null>(null)
    const [hospitalDetail, setHospitalDetail] = useState<HospitalDetail | null>(null)
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [expandedBranches, setExpandedBranches] = useState<Set<string>>(new Set())
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleSearch = useCallback((value: string) => {
        setQuery(value)
        if (timerRef.current) clearTimeout(timerRef.current)
        if (value.trim().length < 2) {
            setResults([])
            setSearched(false)
            return
        }
        timerRef.current = setTimeout(async () => {
            setSearching(true)
            try {
                const data = await searchHospitals(value.trim())
                setResults(data)
                setSearched(true)
            } catch {
                setResults([])
            } finally {
                setSearching(false)
            }
        }, 400)
    }, [])

    const toggleHospital = async (hospitalName: string) => {
        if (expandedHospital === hospitalName) {
            setExpandedHospital(null)
            setHospitalDetail(null)
            setExpandedBranches(new Set())
            return
        }
        setExpandedHospital(hospitalName)
        setExpandedBranches(new Set())
        setLoadingDetail(true)
        try {
            const detail = await getHospitalDetail(hospitalName)
            setHospitalDetail(detail)
            // Auto-expand first branch
            if (detail && detail.branches.length > 0) {
                setExpandedBranches(new Set([detail.branches[0].chamber]))
            }
        } catch {
            setHospitalDetail(null)
        } finally {
            setLoadingDetail(false)
        }
    }

    const toggleBranch = (chamber: string) => {
        setExpandedBranches((prev) => {
            const next = new Set(prev)
            if (next.has(chamber)) next.delete(chamber)
            else next.add(chamber)
            return next
        })
    }

    return (
        <div className="min-h-screen pt-24 pb-16 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
                                    bg-gradient-to-br from-primary-500/20 to-accent-500/20
                                    border border-white/10 mb-4">
                        <Building2 className="w-8 h-8 text-primary-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Find Hospitals</h1>
                    <p className="text-gray-400">Search hospitals by name to discover branches, specialists and doctors</p>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Type hospital name (e.g. Square, Apollo, Labaid, Popular...)"
                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-dark-800/80 border border-white/10
                                   text-white placeholder-gray-500 text-base
                                   focus:outline-none focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20
                                   transition-all"
                    />
                    {searching && (
                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400 animate-spin" />
                    )}
                </div>

                {/* Results */}
                {searched && results.length === 0 && !searching && (
                    <div className="text-center py-12">
                        <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No hospitals found for &ldquo;{query}&rdquo;</p>
                        <p className="text-sm text-gray-500 mt-1">Try a different search term</p>
                    </div>
                )}

                <div className="space-y-4">
                    {results.map((hospital) => (
                        <div key={hospital.hospital} className="glass-card overflow-hidden">
                            {/* Hospital Header */}
                            <button
                                onClick={() => toggleHospital(hospital.hospital)}
                                className="w-full p-5 flex items-center justify-between text-left
                                           hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20
                                                    border border-white/10 flex items-center justify-center flex-shrink-0">
                                        <Building2 className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-lg font-semibold text-white truncate">
                                            {hospital.hospital}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-1 flex-wrap">
                                            <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                                <Users className="w-4 h-4" />
                                                {hospital.doctorCount} doctor{hospital.doctorCount !== 1 ? 's' : ''}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-sm text-gray-400">
                                                <Stethoscope className="w-4 h-4" />
                                                {hospital.specializations.length} specialization{hospital.specializations.length !== 1 ? 's' : ''}
                                            </span>
                                            {hospital.branchCount > 1 && (
                                                <span className="flex items-center gap-1.5 text-sm text-accent-400">
                                                    <GitBranch className="w-4 h-4" />
                                                    {hospital.branchCount} branch{hospital.branchCount !== 1 ? 'es' : ''}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {expandedHospital === hospital.hospital
                                    ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                }
                            </button>

                            {/* Specialization Tags (always visible) */}
                            <div className="px-5 pb-4 flex flex-wrap gap-1.5">
                                {hospital.specializations.slice(0, 8).map((spec) => (
                                    <span
                                        key={spec}
                                        className="px-2.5 py-1 rounded-lg bg-primary-500/10 border border-primary-500/20
                                                   text-xs font-medium text-primary-300"
                                    >
                                        {formatSpecialization(spec)}
                                    </span>
                                ))}
                                {hospital.specializations.length > 8 && (
                                    <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10
                                                     text-xs font-medium text-gray-400">
                                        +{hospital.specializations.length - 8} more
                                    </span>
                                )}
                            </div>

                            {/* Branch Locations (always visible when >1 branch) */}
                            {hospital.branchCount > 1 && (
                                <div className="px-5 pb-4 flex flex-wrap gap-1.5">
                                    {hospital.branches.slice(0, 6).map((branch) => (
                                        <span
                                            key={branch}
                                            className="px-2.5 py-1 rounded-lg bg-accent-500/10 border border-accent-500/20
                                                       text-xs font-medium text-accent-300 flex items-center gap-1"
                                        >
                                            <MapPin className="w-3 h-3" />
                                            {branch}
                                        </span>
                                    ))}
                                    {hospital.branches.length > 6 && (
                                        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10
                                                         text-xs font-medium text-gray-400">
                                            +{hospital.branches.length - 6} more
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Expanded Detail */}
                            {expandedHospital === hospital.hospital && (
                                <div className="border-t border-white/10">
                                    {loadingDetail ? (
                                        <div className="flex items-center justify-center py-10">
                                            <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                                            <span className="ml-2 text-gray-400">Loading doctors...</span>
                                        </div>
                                    ) : hospitalDetail ? (
                                        <div className="p-5 space-y-4">
                                            {/* Summary */}
                                            <div className="text-sm text-gray-400 mb-2">
                                                {hospitalDetail.totalDoctors} doctors across {hospitalDetail.branches.length} location{hospitalDetail.branches.length !== 1 ? 's' : ''}
                                            </div>

                                            {/* Branches */}
                                            {hospitalDetail.branches.map((branch) => {
                                                const branchDoctorCount = branch.specializations.reduce((sum, s) => sum + s.doctors.length, 0)
                                                const isExpanded = expandedBranches.has(branch.chamber)
                                                return (
                                                    <div key={branch.chamber} className="rounded-xl border border-white/10 overflow-hidden">
                                                        {/* Branch Header */}
                                                        <button
                                                            onClick={() => toggleBranch(branch.chamber)}
                                                            className="w-full px-4 py-3 flex items-center justify-between
                                                                       bg-white/5 hover:bg-white/8 transition-colors text-left"
                                                        >
                                                            <div className="flex items-center gap-3 min-w-0">
                                                                <MapPin className="w-5 h-5 text-accent-400 flex-shrink-0" />
                                                                <div className="min-w-0">
                                                                    <h4 className="text-sm font-semibold text-white truncate">
                                                                        {branch.chamber}
                                                                    </h4>
                                                                    {branch.address && branch.address !== branch.chamber && (
                                                                        <p className="text-xs text-gray-500 truncate">{branch.address}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3 flex-shrink-0">
                                                                <span className="text-xs text-gray-500">
                                                                    {branchDoctorCount} doctor{branchDoctorCount !== 1 ? 's' : ''} · {branch.specializations.length} dept{branch.specializations.length !== 1 ? 's' : ''}
                                                                </span>
                                                                {isExpanded
                                                                    ? <ChevronUp className="w-4 h-4 text-gray-400" />
                                                                    : <ChevronDown className="w-4 h-4 text-gray-400" />
                                                                }
                                                            </div>
                                                        </button>

                                                        {/* Branch Doctors */}
                                                        {isExpanded && (
                                                            <div className="p-4 space-y-5">
                                                                {branch.specializations.map((specGroup) => (
                                                                    <div key={specGroup.name}>
                                                                        <div className="flex items-center gap-2 mb-3">
                                                                            <Stethoscope className="w-4 h-4 text-primary-400" />
                                                                            <h5 className="text-sm font-semibold text-primary-300 uppercase tracking-wider">
                                                                                {formatSpecialization(specGroup.name)}
                                                                            </h5>
                                                                            <span className="text-xs text-gray-500">
                                                                                ({specGroup.doctors.length})
                                                                            </span>
                                                                        </div>
                                                                        <div className="grid gap-3 sm:grid-cols-2">
                                                                            {specGroup.doctors.map((doc) => (
                                                                                <div
                                                                                    key={doc.id}
                                                                                    className="p-4 rounded-xl bg-white/5 border border-white/5
                                                                                               hover:border-white/10 transition-colors"
                                                                                >
                                                                                    <div className="flex items-start justify-between mb-2">
                                                                                        <h5 className="text-sm font-semibold text-white leading-tight">
                                                                                            {doc.name}
                                                                                        </h5>
                                                                                        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                                                                                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                                                                            <span className="text-xs font-semibold text-yellow-300">
                                                                                                {doc.rating}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>

                                                                                    {doc.experience != null && (
                                                                                        <p className="text-xs text-gray-400 flex items-center gap-1 mb-1.5">
                                                                                            <Clock className="w-3 h-3" />
                                                                                            {doc.experience} years experience
                                                                                        </p>
                                                                                    )}

                                                                                    {doc.degrees.length > 0 && (
                                                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                                                            {doc.degrees.slice(0, 3).map((deg, i) => (
                                                                                                <span
                                                                                                    key={i}
                                                                                                    className="px-2 py-0.5 rounded bg-amber-500/10
                                                                                                               border border-amber-500/15
                                                                                                               text-[10px] font-medium text-amber-300"
                                                                                                >
                                                                                                    {deg}
                                                                                                </span>
                                                                                            ))}
                                                                                            {doc.degrees.length > 3 && (
                                                                                                <span className="text-[10px] text-gray-500">
                                                                                                    +{doc.degrees.length - 3}
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                    )}

                                                                                    {doc.helpline && doc.helpline !== 'N/A' && (
                                                                                        <a
                                                                                            href={`tel:${doc.helpline}`}
                                                                                            className="flex items-center gap-1 text-xs text-primary-400
                                                                                                       hover:text-primary-300 transition-colors"
                                                                                        >
                                                                                            <Phone className="w-3 h-3" />
                                                                                            {doc.helpline}
                                                                                        </a>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        <div className="p-5 text-center text-gray-400">
                                            Failed to load hospital details.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
