import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contract = await prisma.contract.findFirst({
      where: { id, userId: user.id },
      include: {
        template: true,
        recipients: {
          include: {
            signatures: true,
          },
        },
        signatures: true,
        auditLogs: {
          include: { user: { select: { name: true, email: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
    }

    return NextResponse.json(contract)
  } catch (error) {
    console.error('Failed to fetch contract:', error)
    return NextResponse.json({ error: 'Failed to fetch contract' }, { status: 500 })
  }
}

export async function PATCH(
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
    const { title, content, status, expiresAt } = body

    const contract = await prisma.contract.findFirst({
      where: { id, userId: user.id },
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
    }

    const updated = await prisma.contract.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(status && { status }),
        ...(expiresAt && { expiresAt: new Date(expiresAt) }),
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        contractId: id,
        userId: user.id,
        action: 'edited',
        details: { fields: Object.keys(body) },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update contract:', error)
    return NextResponse.json({ error: 'Failed to update contract' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contract = await prisma.contract.findFirst({
      where: { id, userId: user.id },
    })

    if (!contract) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 })
    }

    await prisma.contract.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete contract:', error)
    return NextResponse.json({ error: 'Failed to delete contract' }, { status: 500 })
  }
}
