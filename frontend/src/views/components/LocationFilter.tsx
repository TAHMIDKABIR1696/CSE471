import { MapPin } from 'lucide-react'

interface LocationFilterProps {
    areas: string[]
    selectedArea: string
    onChange: (area: string) => void
    disabled?: boolean
}

export default function LocationFilter({ areas, selectedArea, onChange, disabled }: LocationFilterProps) {
    if (areas.length === 0) return null

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Filter by area:</span>
            </div>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onChange('')}
                    disabled={disabled}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                        ${selectedArea === ''
                            ? 'bg-primary-500/20 border border-primary-500/40 text-primary-300'
                            : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-gray-300'
                        } disabled:opacity-50`}
                >
                    All Dhaka
                </button>
                {areas.map((area) => (
                    <button
                        key={area}
                        onClick={() => onChange(area)}
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
    )
}
