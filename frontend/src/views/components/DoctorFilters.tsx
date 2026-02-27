import { MapPin, Clock, Filter } from 'lucide-react'

const EXPERIENCE_RANGES = [
    { label: 'All', min: undefined, max: undefined },
    { label: '0–5 yrs', min: 0, max: 5 },
    { label: '5–10 yrs', min: 5, max: 10 },
    { label: '10–15 yrs', min: 10, max: 15 },
    { label: '15–20 yrs', min: 15, max: 20 },
    { label: '20+ yrs', min: 20, max: undefined }
]

export interface ExperienceRange {
    min?: number
    max?: number
}

interface DoctorFiltersProps {
    areas: string[]
    selectedArea: string
    onAreaChange: (area: string) => void
    selectedExpRange: ExperienceRange
    onExpRangeChange: (range: ExperienceRange) => void
    disabled?: boolean
}

function expRangeMatch(a: ExperienceRange, b: typeof EXPERIENCE_RANGES[number]): boolean {
    return a.min === b.min && a.max === b.max
}

export default function DoctorFilters({
    areas,
    selectedArea,
    onAreaChange,
    selectedExpRange,
    onExpRangeChange,
    disabled
}: DoctorFiltersProps) {
    return (
        <div className="glass-card p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <Filter className="w-4 h-4 text-primary-400" />
                <span>Filter Doctors</span>
            </div>

            {/* Location Filter */}
            {areas.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Location</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onAreaChange('')}
                            disabled={disabled}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                                ${selectedArea === ''
                                    ? 'bg-primary-500/20 border border-primary-500/40 text-primary-300'
                                    : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-300'
                                } disabled:opacity-50`}
                        >
                            All Areas
                        </button>
                        {areas.map((area) => (
                            <button
                                key={area}
                                onClick={() => onAreaChange(area)}
                                disabled={disabled}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                                    ${selectedArea === area
                                        ? 'bg-primary-500/20 border border-primary-500/40 text-primary-300'
                                        : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-300'
                                    } disabled:opacity-50`}
                            >
                                {area}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience Filter */}
            <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Years of Experience</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {EXPERIENCE_RANGES.map((range) => {
                        const isActive = expRangeMatch(selectedExpRange, range)
                        return (
                            <button
                                key={range.label}
                                onClick={() => onExpRangeChange({ min: range.min, max: range.max })}
                                disabled={disabled}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                                    ${isActive
                                        ? 'bg-accent-500/20 border border-accent-500/40 text-accent-300'
                                        : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-300'
                                    } disabled:opacity-50`}
                            >
                                {range.label}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
