import { HeartPulse, Github, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-dark-950/80 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                                <HeartPulse className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-base font-bold gradient-text">HealthConnect</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            AI-powered healthcare guidance for finding the right doctor in Dhaka, Bangladesh.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-4">Quick Links</h4>
                        <nav className="space-y-2">
                            <Link to="/" className="block text-gray-500 hover:text-primary-400 text-sm transition-colors">Home</Link>
                            <Link to="/consult" className="block text-gray-500 hover:text-primary-400 text-sm transition-colors">Consult Now</Link>
                            <a href="#how-it-works" className="block text-gray-500 hover:text-primary-400 text-sm transition-colors">How It Works</a>
                        </nav>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-4">Emergency</h4>
                        <p className="text-gray-500 text-sm mb-2">
                            For medical emergencies, call:
                        </p>
                        <p className="text-2xl font-bold text-red-400">999</p>
                        <p className="text-gray-600 text-xs mt-1">National Emergency Service, Bangladesh</p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-600 text-xs">
                        © {new Date().getFullYear()} HealthConnect Dhaka. CSE471 Project. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-gray-600 hover:text-gray-400 transition-colors">
                            <Github className="w-4 h-4" />
                        </a>
                        <a href="#" className="text-gray-600 hover:text-gray-400 transition-colors">
                            <Mail className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
