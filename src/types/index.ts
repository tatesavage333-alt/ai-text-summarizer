export interface Summary {
  id: string
  originalText: string
  summaryText: string
  summaryStyle: SummaryStyle
  createdAt: Date
  updatedAt: Date
}

export type SummaryStyle = 'concise' | 'detailed' | 'bullet-points'

export interface CreateSummaryRequest {
  originalText: string
  summaryStyle?: SummaryStyle
}

export interface CreateSummaryResponse {
  success: boolean
  data?: Summary
  error?: string
}

export interface GetSummariesResponse {
  success: boolean
  data?: Summary[]
  error?: string
}
