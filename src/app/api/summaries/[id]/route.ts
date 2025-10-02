import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const summary = await prisma.summary.findUnique({
      where: { id },
    })

    if (!summary) {
      return NextResponse.json(
        { success: false, error: 'Summary not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: summary,
    })
  } catch (error) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch summary' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const summary = await prisma.summary.findUnique({
      where: { id },
    })

    if (!summary) {
      return NextResponse.json(
        { success: false, error: 'Summary not found' },
        { status: 404 }
      )
    }

    await prisma.summary.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Summary deleted successfully',
    })
  } catch (error) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Failed to delete summary' },
      { status: 500 }
    )
  }
}
