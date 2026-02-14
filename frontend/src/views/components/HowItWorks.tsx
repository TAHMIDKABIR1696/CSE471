import { MessageSquareText, Brain, UserCheck } from 'lucide-react'

const steps = [
    {
        number: '01',
        icon: MessageSquareText,
        title: 'Describe Your Symptoms',
        description: 'Tell us how you\'re feeling in plain, everyday language. No medical jargon needed — just describe what\'s bothering you.',
        color: 'from-primary-500 to-blue-500',
    },
    {
        number: '02',
        icon: Brain,
        title: 'AI Analyzes & Triages',
        description: 'Our AI engine processes your symptoms using trained medical datasets to determine the right medical specialty and urgency level.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        number: '03',
        icon: UserCheck,
        title: 'Get Doctor Recommendations',
        description: 'Receive curated recommendations of top-rated doctors in Dhaka, complete with contact info, location, and Google Maps directions.',
        color: 'from-accent-500 to-emerald-500',
    },
]

export default function HowItWorks() {
    return (
        <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 relative">
            {/* Background accent */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative max-w-5xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        How It <span className="gradient-text">Works</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Three simple steps to find the right healthcare professional for your needs.
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            {/* Connector line (desktop) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-white/10 to-transparent" />
                            )}

                            <div className="glass-card p-8 text-center group hover:bg-white/10 transition-all duration-300">
                                {/* Step number */}
                                <div className="text-5xl font-black text-white/5 absolute top-4 right-6 select-none group-hover:text-white/10 transition-colors">
                                    {step.number}
                                </div>

                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center
                                mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <step.icon className="w-7 h-7 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
