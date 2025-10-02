'use client'

import { useState } from 'react'
import { SummaryStyle } from '@/types'
import { Loader2, FileText } from 'lucide-react'

interface SummaryFormProps {
  onSummaryCreated: () => void
}

export default function SummaryForm({ onSummaryCreated }: SummaryFormProps) {
  const [text, setText] = useState('')
  const [summaryStyle, setSummaryStyle] = useState<SummaryStyle>('concise')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!text.trim()) {
      setError('Please enter some text to summarize')
      return
    }

    if (text.length > 10000) {
      setError('Text is too long. Please limit to 10,000 characters.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/summaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalText: text,
          summaryStyle,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create summary')
      }

      setText('')
      onSummaryCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const characterCount = text.length
  const isOverLimit = characterCount > 10000

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center mb-4">
        <FileText className="w-6 h-6 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Create Summary</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            Text to Summarize
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
            className={`w-full h-40 p-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isOverLimit ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-1">
            <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
              {characterCount.toLocaleString()} / 10,000 characters
            </span>
          </div>
        </div>

        <div>
          <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
            Summary Style
          </label>
          <select
            id="style"
            value={summaryStyle}
            onChange={(e) => setSummaryStyle(e.target.value as SummaryStyle)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="concise">Concise - Brief and to the point</option>
            <option value="detailed">Detailed - Comprehensive with context</option>
            <option value="bullet-points">Bullet Points - Organized list format</option>
          </select>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !text.trim() || isOverLimit}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Summary...
            </>
          ) : (
            'Summarize Text'
          )}
        </button>
      </form>
    </div>
  )
}
