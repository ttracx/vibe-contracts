import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { generateContract } from '@/lib/ai'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, variables } = body

    if (!type) {
      return NextResponse.json({ error: 'Contract type is required' }, { status: 400 })
    }

    const content = await generateContract(type, variables || {})

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Failed to generate contract:', error)
    return NextResponse.json({ error: 'Failed to generate contract' }, { status: 500 })
  }
}
