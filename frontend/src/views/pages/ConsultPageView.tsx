import { useState } from 'react'
import ChatBox from '../components/ChatBox'
import TriageResult from '../components/TriageResult'
import DoctorCard from '../components/DoctorCard'
import DoctorDetailModal from '../components/DoctorDetailModal'
import DoctorFilters from '../components/DoctorFilters'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { useConsultController } from '../../controllers/useConsultController'
import { Doctor } from '../../models/consult.model'

export default function ConsultPageView() {
    const { state, expRange, handleSubmit, handleReset, handleAreaChange, handleExpRangeChange, clearError } = useConsultController()
    const { step, isLoading, triageData, doctors, error, userSymptoms, selectedArea, availableAreas } = state
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)

    return (
        <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-5xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                        {step === 'input' ? (
                            <>AI Health <span className="gradient-text">Consultation</span></>
                        ) : (
                            <>Your <span className="gradient-text">Results</span></>
                        )}
                    </h1>
                    <p className="text-gray-400 max-w-xl mx-auto">
                        {step === 'input'
                            ? 'Describe your symptoms below and our AI will recommend the right specialist for you.'
                            : 'Based on your symptoms, here are our recommendations.'}
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="max-w-3xl mx-auto mb-6 animate-slide-up">
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <p>{error}</p>
                            <button onClick={clearError} className="ml-auto text-red-400 hover:text-red-300 underline text-xs">
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}

                {/* Step: Input */}
                {step === 'input' && (
                    <ChatBox onSubmit={handleSubmit} isLoading={isLoading} />
                )}

                {/* Step: Results */}
                {step === 'result' && triageData && (
                    <div className="space-y-8">
                        {/* User's Input Summary */}
                        <div className="max-w-3xl mx-auto">
                            <div className="glass-card p-4 flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                                    <span className="text-sm">💬</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Your symptoms</p>
                                    <p className="text-sm text-gray-300">{userSymptoms}</p>
                                </div>
                            </div>
                        </div>

                        {/* Triage Result */}
                        <TriageResult
                            specialization={triageData.specialization}
                            urgency={triageData.urgency}
                        />

                        {/* Emergency Banner */}
                        {triageData.urgency === 'EMERGENCY' && (
                            <div className="max-w-3xl mx-auto animate-slide-up">
                                <div className="p-5 rounded-xl bg-red-500/15 border-2 border-red-500/30 text-center">
                                    <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-3" />
                                    <h3 className="text-lg font-bold text-red-300 mb-1">Immediate Medical Attention Required</h3>
                                    <p className="text-red-400/80 text-sm mb-3">
                                        Your symptoms may indicate a life-threatening condition.
                                    </p>
                                    <a
                                        href="tel:999"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white font-semibold
                               hover:bg-red-600 transition-colors text-sm shadow-lg shadow-red-500/30"
                                    >
                                        📞 Call 999 Now
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Doctor Recommendations */}
                        {doctors.length > 0 && (
                            <div className="max-w-3xl mx-auto">
                                <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                                    👨‍⚕️ Recommended Doctors in Dhaka
                                    <span className="text-sm font-normal text-gray-500">
                                        ({doctors.length} found)
                                    </span>
                                </h3>

                                {/* Filters */}
                                <div className="mb-5">
                                    <DoctorFilters
                                        areas={availableAreas}
                                        selectedArea={selectedArea}
                                        onAreaChange={handleAreaChange}
                                        selectedExpRange={expRange}
                                        onExpRangeChange={handleExpRangeChange}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {doctors.map((doctor, index) => (
                                        <DoctorCard key={doctor.id} doctor={doctor} index={index} onSelect={setSelectedDoctor} />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* No doctors found */}
                        {doctors.length === 0 && (
                            <div className="max-w-3xl mx-auto">
                                {/* Filters even when no results */}
                                <div className="mb-5">
                                    <DoctorFilters
                                        areas={availableAreas}
                                        selectedArea={selectedArea}
                                        onAreaChange={handleAreaChange}
                                        selectedExpRange={expRange}
                                        onExpRangeChange={handleExpRangeChange}
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="text-center py-8">
                                    <p className="text-gray-500 text-sm">
                                        {selectedArea
                                            ? `No doctors found in ${selectedArea}. Try selecting a different area or "All Dhaka".`
                                            : 'No doctors found for this specialization. Please try again or consult a general physician.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="max-w-3xl mx-auto flex items-center justify-center gap-4 pt-4">
                            <button
                                onClick={handleReset}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-white/10
                           text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20
                           transition-all text-sm font-medium"
                            >
                                <RotateCcw className="w-4 h-4" />
                                New Consultation
                            </button>
                        </div>

                        {/* Disclaimer */}
                        <div className="max-w-3xl mx-auto">
                            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-400/60 text-xs text-center">
                                This is an AI-assisted recommendation and does not replace professional medical advice.
                                Always consult a qualified healthcare provider.
                            </div>
                        </div>
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
        </div>
    )
}
