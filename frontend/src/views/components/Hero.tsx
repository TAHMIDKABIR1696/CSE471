import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight, ShieldCheck, Activity } from 'lucide-react'

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute top-60 -left-40 w-96 h-96 bg-accent-500/8 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
            </div>

            <div className="relative max-w-5xl mx-auto text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20
                        text-primary-300 text-sm font-medium mb-8 animate-fade-in">
                    <Sparkles className="w-4 h-4" />
                    AI-Powered Healthcare Guidance
                </div>

                {/* Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 animate-slide-up text-balance">
                    Find the Right Doctor{' '}
                    <br className="hidden sm:block" />
                    <span className="gradient-text">in Dhaka, Instantly</span>
                </h1>

                {/* Subheading */}
                <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in text-balance">
                    Describe your symptoms in plain language. Our AI analyzes your condition and recommends
                    the best specialists and hospitals in Dhaka — no guesswork needed.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up">
                    <Link to="/consult" className="gradient-button group text-base">
                        Start Free Consultation
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <a href="#how-it-works" className="px-8 py-3.5 rounded-xl border border-white/10 text-gray-300
                                             hover:bg-white/5 hover:border-white/20 transition-all text-base font-medium">
                        How It Works
                    </a>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 animate-fade-in">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-accent-400" />
                        <span>Safe & Ethical</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-primary-400" />
                        <span>40+ Top Doctors</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        <span>AI-Powered Triage</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
