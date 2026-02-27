import { MapPin, Phone, Building2, Star, Navigation, User, Clock } from 'lucide-react'

interface Doctor {
    id: string
    name: string
    specialization: string
    experience: number | null
    hospital: string
    chamber: string
    helpline: string
    address: string
    mapsLink: string
    rating: number
}

interface DoctorCardProps {
    doctor: Doctor
    index: number
}

export default function DoctorCard({ doctor, index }: DoctorCardProps) {
    return (
        <div
            className="glass-card-hover p-6 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500/30 to-accent-500/30
                          border border-white/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-primary-300" />
                    </div>
                    <div>
                        <h4 className="text-base font-semibold text-white leading-tight">{doctor.name}</h4>
                        <p className="text-xs text-primary-400 mt-0.5">{doctor.specialization.replace('_', ' ')}</p>
                        {doctor.experience != null && (
                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {doctor.experience} years experience
                            </p>
                        )}
                    </div>
                </div>
                {/* Rating */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-yellow-300">{doctor.rating}</span>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-2.5 mb-5">
                <div className="flex items-start gap-2.5">
                    <Building2 className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-gray-600">Hospital</p>
                        <p className="text-sm text-gray-300">{doctor.hospital}</p>
                    </div>
                </div>
                <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-gray-600">Chamber Address</p>
                        <p className="text-sm text-gray-300">{doctor.chamber}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{doctor.address}</p>
                    </div>
                </div>
                <div className="flex items-start gap-2.5">
                    <Phone className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-xs text-gray-600">Helpline</p>
                        <a
                            href={`tel:${doctor.helpline}`}
                            className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
                        >
                            {doctor.helpline}
                        </a>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <a
                href={doctor.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                   bg-accent-500/15 border border-accent-500/20 text-accent-300
                   hover:bg-accent-500/25 hover:border-accent-500/30
                   transition-all text-sm font-medium"
            >
                <Navigation className="w-4 h-4" />
                Get Directions on Google Maps
            </a>
        </div>
    )
}
