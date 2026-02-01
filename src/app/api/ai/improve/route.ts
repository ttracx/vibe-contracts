import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { improveClause } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content } = body

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const improved = await improveClause(content)

    return NextResponse.json({ improved })
  } catch (error) {
    console.error('Failed to improve content:', error)
    return NextResponse.json({ error: 'Failed to improve content' }, { status: 500 })
  }
}
