import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { recipients, message, expiresInDays } = body

    // Validate contract exists and belongs to user
    const contract = await prisma.contract.findFirst({
      where: { id, userId: user.id },
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
    }

    // Create recipients
    const createdRecipients = await Promise.all(
      recipients.map(async (r: { name: string; email: string; role?: string }, index: number) => {
        return prisma.recipient.create({
          data: {
            contractId: id,
            name: r.name,
            email: r.email,
            role: r.role || 'signer',
            order: index + 1,
            status: 'sent',
          },
        })
      })
    )

    // Update contract status
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null

    await prisma.contract.update({
      where: { id },
      data: {
        status: 'pending',
        ...(expiresAt && { expiresAt }),
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        contractId: id,
        userId: user.id,
        action: 'sent',
        details: {
          recipients: recipients.map((r: { email: string }) => r.email),
          message,
        },
      },
    })

    // In production, you would send emails here with signing links
    // For each recipient: `${process.env.NEXT_PUBLIC_APP_URL}/sign/${recipient.accessToken}`

    return NextResponse.json({
      success: true,
      recipients: createdRecipients,
    })
  } catch (error) {
    console.error('Failed to send contract:', error)
    return NextResponse.json({ error: 'Failed to send contract' }, { status: 500 })
  }
}
