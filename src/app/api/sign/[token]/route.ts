import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Get contract for signing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    const recipient = await prisma.recipient.findUnique({
      where: { accessToken: token },
      include: {
        contract: {
          include: {
            user: { select: { name: true, company: true } },
            recipients: { select: { name: true, email: true, status: true, signedAt: true } },
          },
        },
        signatures: true,
      },
    })

    if (!recipient) {
      return NextResponse.json({ error: 'Invalid or expired link' }, { status: 404 })
    }

    if (recipient.contract.status === 'expired') {
      return NextResponse.json({ error: 'This contract has expired' }, { status: 410 })
    }

    if (recipient.contract.status === 'canceled') {
      return NextResponse.json({ error: 'This contract has been canceled' }, { status: 410 })
    }

    // Mark as viewed
    if (!recipient.viewedAt) {
      await prisma.recipient.update({
        where: { id: recipient.id },
        data: { viewedAt: new Date(), status: 'viewed' },
      })

      await prisma.auditLog.create({
        data: {
          contractId: recipient.contractId,
          action: 'viewed',
          details: { recipientEmail: recipient.email },
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          userAgent: request.headers.get('user-agent'),
        },
      })
    }

    return NextResponse.json({
      recipient: {
        id: recipient.id,
        name: recipient.name,
        email: recipient.email,
        role: recipient.role,
        status: recipient.status,
        hasSigned: recipient.signatures.length > 0,
      },
      contract: {
        id: recipient.contract.id,
        title: recipient.contract.title,
        content: recipient.contract.content,
        status: recipient.contract.status,
        sender: recipient.contract.user,
        recipients: recipient.contract.recipients,
      },
    })
  } catch (error) {
    console.error('Failed to get signing data:', error)
    return NextResponse.json({ error: 'Failed to load contract' }, { status: 500 })
  }
}

// Submit signature
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const body = await request.json()
    const { signature, type } = body

    const recipient = await prisma.recipient.findUnique({
      where: { accessToken: token },
      include: { contract: true },
    })

    if (!recipient) {
      return NextResponse.json({ error: 'Invalid or expired link' }, { status: 404 })
    }

    if (recipient.status === 'signed') {
      return NextResponse.json({ error: 'You have already signed this contract' }, { status: 400 })
    }

    // Create signature
    await prisma.signature.create({
      data: {
        contractId: recipient.contractId,
        recipientId: recipient.id,
        type: type || 'draw',
        data: signature,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    })

    // Update recipient status
    await prisma.recipient.update({
      where: { id: recipient.id },
      data: { status: 'signed', signedAt: new Date() },
    })

    // Check if all recipients have signed
    const allRecipients = await prisma.recipient.findMany({
      where: { contractId: recipient.contractId },
    })

    const allSigned = allRecipients.every((r) => r.status === 'signed')

    if (allSigned) {
      await prisma.contract.update({
        where: { id: recipient.contractId },
        data: { status: 'completed', completedAt: new Date() },
      })
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        contractId: recipient.contractId,
        action: 'signed',
        details: { recipientEmail: recipient.email, signatureType: type },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    })

    return NextResponse.json({
      success: true,
      allSigned,
    })
  } catch (error) {
    console.error('Failed to submit signature:', error)
    return NextResponse.json({ error: 'Failed to submit signature' }, { status: 500 })
  }
}
