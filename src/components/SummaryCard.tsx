'use client'

import { useState } from 'react'
import { Summary } from '@/types'
import { Calendar, FileText, Trash2, ChevronDown, ChevronUp } from 'lucide-react'

interface SummaryCardProps {
  summary: Summary
  onDelete: (id: string) => void
}

export default function SummaryCard({ summary, onDelete }: SummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this summary?')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/summaries/${summary.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to delete summary')
      }

      onDelete(summary.id)
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete summary. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStyleBadgeColor = (style: string) => {
    switch (style) {
      case 'concise':
        return 'bg-blue-100 text-blue-800'
      case 'detailed':
        return 'bg-green-100 text-green-800'
      case 'bullet-points':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStyleBadgeColor(summary.summaryStyle)}`}>
            {summary.summaryStyle.replace('-', ' ')}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(summary.createdAt)}
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-500 hover:text-red-700 p-1 rounded disabled:opacity-50"
          title="Delete summary"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-600" />
            Summary
          </h3>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-gray-700 whitespace-pre-wrap">{summary.summaryText}</p>
          </div>
        </div>

        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Hide Original Text
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Show Original Text
              </>
            )}
          </button>
          
          {isExpanded && (
            <div className="mt-2 bg-gray-50 p-4 rounded-md">
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{summary.originalText}</p>
            </div>
          )}
          
          {!isExpanded && (
            <div className="mt-2 text-gray-500 text-sm">
              {truncateText(summary.originalText, 150)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
