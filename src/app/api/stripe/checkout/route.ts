import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || !user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      const session = await createCheckoutSession(user.id, user.email)
      return NextResponse.json({ url: session.url })
    } catch (error) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }
  } catch (error) {
    console.error('Failed to create checkout session:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
