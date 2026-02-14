import { AlertTriangle } from 'lucide-react'

export default function Disclaimer() {
    return (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="glass-card p-6 sm:p-8 border-amber-500/20 bg-amber-500/5">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-amber-300 mb-2">
                                Medical Disclaimer
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                HealthConnect Dhaka is an <strong className="text-gray-300">AI-assisted healthcare guidance tool</strong> designed
                                to help you find appropriate medical professionals. It does <strong className="text-gray-300">not replace professional
                                    medical advice</strong>, diagnosis, or treatment. Always consult a qualified healthcare provider for any medical
                                concerns. In case of a medical emergency, please call <strong className="text-amber-300">999</strong> or visit
                                your nearest emergency department immediately.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
