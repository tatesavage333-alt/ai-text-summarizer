import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateSummary } from '@/lib/openai'
import { CreateSummaryRequest, SummaryStyle } from '@/types'

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
  return ip
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 10 // 10 requests per 15 minutes

  const current = rateLimitMap.get(key)
  
  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (current.count >= maxRequests) {
    return false
  }
  
  current.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request)
    if (!checkRateLimit(rateLimitKey)) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    const body: CreateSummaryRequest = await request.json()
    const { originalText, summaryStyle = 'concise' } = body

    // Validation
    if (!originalText || typeof originalText !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Original text is required' },
        { status: 400 }
      )
    }

    if (originalText.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Original text cannot be empty' },
        { status: 400 }
      )
    }

    if (originalText.length > 10000) {
      return NextResponse.json(
        { success: false, error: 'Text is too long. Please limit to 10,000 characters.' },
        { status: 400 }
      )
    }

    const validStyles: SummaryStyle[] = ['concise', 'detailed', 'bullet-points']
    if (!validStyles.includes(summaryStyle)) {
      return NextResponse.json(
        { success: false, error: 'Invalid summary style' },
        { status: 400 }
      )
    }

    // Generate summary using OpenAI
    const summaryText = await generateSummary(originalText, summaryStyle)

    // Save to database
    const summary = await prisma.summary.create({
      data: {
        originalText,
        summaryText,
        summaryStyle,
      },
    })

    return NextResponse.json({
      success: true,
      data: summary,
    })
  } catch (error) {
    console.error('API Error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const style = searchParams.get('style') as SummaryStyle | null
    
    const whereClause: Record<string, unknown> = {}
    
    // Add search filter
    if (search) {
      whereClause.OR = [
        { originalText: { contains: search, mode: 'insensitive' } },
        { summaryText: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    // Add style filter
    if (style && ['concise', 'detailed', 'bullet-points'].includes(style)) {
      whereClause.summaryStyle = style
    }

    const summaries = await prisma.summary.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to 50 most recent summaries
    })

    return NextResponse.json({
      success: true,
      data: summaries,
    })
  } catch (error) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch summaries' },
      { status: 500 }
    )
  }
}
