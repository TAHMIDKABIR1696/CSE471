import { Bot, Stethoscope, MapPin, ShieldCheck, Clock, Star } from 'lucide-react'

const features = [
    {
        icon: Bot,
        title: 'AI Symptom Analysis',
        description: 'Describe your symptoms in natural language. Our AI processes your input using trained medical datasets and advanced language models.',
        color: 'from-primary-500 to-blue-500',
        shadowColor: 'shadow-primary-500/20',
    },
    {
        icon: Stethoscope,
        title: 'Smart Specialist Matching',
        description: 'Get matched to the right medical specialty — cardiologist, neurologist, dermatologist, and more — based on your condition.',
        color: 'from-accent-500 to-emerald-500',
        shadowColor: 'shadow-accent-500/20',
    },
    {
        icon: MapPin,
        title: 'Top Doctors in Dhaka',
        description: 'We recommend the best and most reputable doctors in Dhaka with hospital details, contact info, and Google Maps directions.',
        color: 'from-purple-500 to-pink-500',
        shadowColor: 'shadow-purple-500/20',
    },
    {
        icon: ShieldCheck,
        title: 'Ethical & Safe',
        description: 'Our platform prioritizes accuracy and safety, complementing — never replacing — professional medical advice.',
        color: 'from-amber-500 to-orange-500',
        shadowColor: 'shadow-amber-500/20',
    },
    {
        icon: Clock,
        title: 'Urgency Assessment',
        description: 'Every triage includes an urgency level (LOW, MEDIUM, HIGH, EMERGENCY) so you know how quickly to seek care.',
        color: 'from-red-500 to-rose-500',
        shadowColor: 'shadow-red-500/20',
    },
    {
        icon: Star,
        title: 'Rated & Verified',
        description: 'Doctor recommendations are sorted by ratings and credibility to ensure you receive the best healthcare possible.',
        color: 'from-cyan-500 to-teal-500',
        shadowColor: 'shadow-cyan-500/20',
    },
]

export default function Features() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Why <span className="gradient-text">HealthConnect?</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Your intelligent healthcare companion that bridges the gap between symptoms and the right specialist.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="glass-card-hover p-6 group"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center
                              mb-5 shadow-lg ${feature.shadowColor} group-hover:scale-110 transition-transform duration-300`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
