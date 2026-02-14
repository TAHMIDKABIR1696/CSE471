import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, HeartPulse } from 'lucide-react'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Consult Now', path: '/consult' },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-t-0 border-x-0 rounded-none">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center
                            shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
                            <HeartPulse className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-lg font-bold gradient-text">
                            HealthConnect
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${location.pathname === link.path
                                        ? 'text-primary-300 bg-primary-500/15'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link to="/consult" className="ml-3 gradient-button !px-5 !py-2 !text-sm">
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t border-white/10 bg-dark-950/95 backdrop-blur-xl animate-slide-up">
                    <div className="px-4 py-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${location.pathname === link.path
                                        ? 'text-primary-300 bg-primary-500/15'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Link
                            to="/consult"
                            onClick={() => setIsOpen(false)}
                            className="block mt-2 gradient-button !text-sm text-center"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
