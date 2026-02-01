import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contracts = await prisma.contract.findMany({
      where: { userId: user.id },
      include: {
        template: { select: { name: true } },
        recipients: true,
        _count: { select: { signatures: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(contracts)
  } catch (error) {
    console.error('Failed to fetch contracts:', error)
    return NextResponse.json({ error: 'Failed to fetch contracts' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, templateId, variables } = body

    const contract = await prisma.contract.create({
      data: {
        title,
        content,
        templateId,
        variables: variables || {},
        userId: user.id,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        contractId: contract.id,
        userId: user.id,
        action: 'created',
        details: { templateId },
      },
    })

    return NextResponse.json(contract, { status: 201 })
  } catch (error) {
    console.error('Failed to create contract:', error)
    return NextResponse.json({ error: 'Failed to create contract' }, { status: 500 })
  }
}
