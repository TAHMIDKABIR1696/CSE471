import { useState } from 'react'
import { Send, Loader2, MessageSquareText } from 'lucide-react'

interface ChatBoxProps {
    onSubmit: (symptoms: string) => void
    isLoading: boolean
}

export default function ChatBox({ onSubmit, isLoading }: ChatBoxProps) {
    const [symptoms, setSymptoms] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (symptoms.trim().length >= 5 && !isLoading) {
            onSubmit(symptoms.trim())
        }
    }

    const examplePrompts = [
        'I have been having chest pain and shortness of breath for 2 days',
        'My child has a high fever and rash on the body',
        'I feel anxious all the time and cannot sleep properly',
        'I have severe lower back pain that gets worse when I bend',
        'I have been having stomach pain and acid reflux after eating',
    ]

    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="glass-card p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                        <MessageSquareText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">Describe Your Symptoms</h2>
                        <p className="text-sm text-gray-500">Tell us what you're experiencing in your own words</p>
                    </div>
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit}>
                    <div className="relative">
                        <textarea
                            id="symptoms-input"
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="e.g., I have been having headaches for the past week, along with dizziness and blurred vision..."
                            className="w-full h-36 px-5 py-4 rounded-xl bg-white/5 border border-white/10
                         text-gray-200 placeholder-gray-600 text-sm leading-relaxed
                         focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/30
                         transition-all resize-none"
                            disabled={isLoading}
                            maxLength={1000}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-gray-600">
                            {symptoms.length}/1000
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs text-gray-600">
                            {symptoms.trim().length < 5
                                ? 'Please enter at least 5 characters'
                                : '✓ Ready to analyze'}
                        </p>
                        <button
                            type="submit"
                            disabled={symptoms.trim().length < 5 || isLoading}
                            className="gradient-button !px-6 !py-2.5 !text-sm disabled:opacity-50 disabled:cursor-not-allowed
                         disabled:hover:scale-100 disabled:shadow-none"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Analyze Symptoms
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Example Prompts */}
                <div className="mt-6 pt-6 border-t border-white/5">
                    <p className="text-xs text-gray-600 mb-3">Try an example:</p>
                    <div className="flex flex-wrap gap-2">
                        {examplePrompts.map((prompt, index) => (
                            <button
                                key={index}
                                onClick={() => setSymptoms(prompt)}
                                disabled={isLoading}
                                className="px-3 py-1.5 text-xs rounded-lg bg-white/5 border border-white/5
                           text-gray-500 hover:text-gray-300 hover:bg-white/10 hover:border-white/10
                           transition-all disabled:opacity-50 disabled:cursor-not-allowed text-left"
                            >
                                {prompt.length > 50 ? prompt.slice(0, 50) + '...' : prompt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
