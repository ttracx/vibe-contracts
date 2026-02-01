import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, getStatusColor } from '@/lib/utils'
import { FileText, Plus, MoreVertical, Eye, Send, Trash } from 'lucide-react'

export default async function ContractsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const contracts = await prisma.contract.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    include: {
      template: { select: { name: true } },
      recipients: { select: { name: true, email: true, status: true } },
      _count: { select: { signatures: true } },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
          <p className="text-gray-600 mt-1">
            Manage all your contracts in one place.
          </p>
        </div>
        <Link href="/dashboard/contracts/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Contract
          </Button>
        </Link>
      </div>

      {contracts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No contracts yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Get started by creating your first contract from a template or from scratch.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/dashboard/templates">
                <Button variant="outline">Browse Templates</Button>
              </Link>
              <Link href="/dashboard/contracts/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Contract
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contracts.map((contract) => (
            <Card key={contract.id} className="hover:border-indigo-200 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <Link href={`/dashboard/contracts/${contract.id}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
                          {contract.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">
                        {contract.template?.name || 'Custom Contract'}
                        <span className="mx-2">•</span>
                        {formatDate(contract.createdAt)}
                      </p>
                      {contract.recipients.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">Recipients:</span>
                          {contract.recipients.slice(0, 3).map((r, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                            >
                              {r.name || r.email}
                            </span>
                          ))}
                          {contract.recipients.length > 3 && (
                            <span className="text-xs text-gray-500">
                              +{contract.recipients.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status}
                    </Badge>
                    <Link href={`/dashboard/contracts/${contract.id}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
