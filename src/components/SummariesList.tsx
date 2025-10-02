'use client'

import { useState, useEffect } from 'react'
import { Summary, SummaryStyle } from '@/types'
import SummaryCard from './SummaryCard'
import { Search, Filter, Loader2, FileX } from 'lucide-react'

interface SummariesListProps {
  refreshTrigger: number
}

export default function SummariesList({ refreshTrigger }: SummariesListProps) {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [filteredSummaries, setFilteredSummaries] = useState<Summary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [styleFilter, setStyleFilter] = useState<SummaryStyle | 'all'>('all')

  const fetchSummaries = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (styleFilter !== 'all') params.append('style', styleFilter)

      const response = await fetch(`/api/summaries?${params.toString()}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch summaries')
      }

      setSummaries(data.data || [])
      setFilteredSummaries(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSummaries()
  }, [refreshTrigger]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Client-side filtering for real-time search
    let filtered = summaries

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = summaries.filter(
        (summary) =>
          summary.originalText.toLowerCase().includes(term) ||
          summary.summaryText.toLowerCase().includes(term)
      )
    }

    if (styleFilter !== 'all') {
      filtered = filtered.filter((summary) => summary.summaryStyle === styleFilter)
    }

    setFilteredSummaries(filtered)
  }, [summaries, searchTerm, styleFilter])

  const handleDelete = (id: string) => {
    setSummaries((prev) => prev.filter((summary) => summary.id !== id))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchSummaries()
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Loading summaries...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <FileX className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Summaries</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchSummaries}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Past Summaries</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search summaries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={styleFilter}
              onChange={(e) => setStyleFilter(e.target.value as SummaryStyle | 'all')}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Styles</option>
              <option value="concise">Concise</option>
              <option value="detailed">Detailed</option>
              <option value="bullet-points">Bullet Points</option>
            </select>
          </div>
        </div>

        {filteredSummaries.length === 0 ? (
          <div className="text-center py-8">
            <FileX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {summaries.length === 0 ? 'No summaries yet' : 'No summaries match your search'}
            </h3>
            <p className="text-gray-500">
              {summaries.length === 0
                ? 'Create your first summary using the form above.'
                : 'Try adjusting your search terms or filters.'}
            </p>
          </div>
        ) : (
          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredSummaries.length} of {summaries.length} summaries
          </div>
        )}
      </div>

      {filteredSummaries.map((summary) => (
        <SummaryCard key={summary.id} summary={summary} onDelete={handleDelete} />
      ))}
    </div>
  )
}
