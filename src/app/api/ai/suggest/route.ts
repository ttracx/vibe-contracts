import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { generateClauseSuggestions } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has pro subscription
    if (user.subscription?.plan !== 'pro' && user.subscription?.status !== 'active') {
      return NextResponse.json(
        { error: 'AI features require a Pro subscription' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { contractType, context } = body

    const suggestions = await generateClauseSuggestions(contractType, context)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Failed to generate suggestions:', error)
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 })
  }
}
