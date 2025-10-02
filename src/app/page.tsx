'use client'

import { useState } from 'react'
import SummaryForm from '@/components/SummaryForm'
import SummariesList from '@/components/SummariesList'
import { Brain, Sparkles } from 'lucide-react'

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSummaryCreated = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Brain className="w-8 h-8 text-blue-600" />
                <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Text Summarizer</h1>
                <p className="text-gray-600">Transform long text into concise, intelligent summaries</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <SummaryForm onSummaryCreated={handleSummaryCreated} />
        <SummariesList refreshTrigger={refreshTrigger} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p>Powered by OpenAI GPT-3.5 Turbo</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
