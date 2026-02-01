import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatDateTime, getStatusColor } from '@/lib/utils'
import { Send, FileText, Clock, CheckCircle, Eye, Mail } from 'lucide-react'

export default async function SentContractsPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const sentContracts = await prisma.contract.findMany({
    where: {
      userId: user.id,
      status: { in: ['pending', 'completed', 'expired'] },
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      recipients: {
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          viewedAt: true,
          signedAt: true,
        },
      },
    },
  })

  const stats = {
    pending: sentContracts.filter((c) => c.status === 'pending').length,
    completed: sentContracts.filter((c) => c.status === 'completed').length,
    awaitingSignature: sentContracts.reduce(
      (acc, c) => acc + c.recipients.filter((r) => r.status !== 'signed').length,
      0
    ),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sent Contracts</h1>
        <p className="text-gray-600 mt-1">
          Track contracts you've sent for signature.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.awaitingSignature}</p>
              <p className="text-sm text-gray-500">Awaiting Signature</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contracts List */}
      {sentContracts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sent contracts
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't sent any contracts for signature yet.
            </p>
            <Link href="/dashboard/contracts">
              <Button>View Your Contracts</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sentContracts.map((contract) => (
            <Card key={contract.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
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
                      <p className="text-sm text-gray-500">
                        Sent {formatDate(contract.updatedAt)}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(contract.status)}>
                    {contract.status}
                  </Badge>
                </div>

                {/* Recipients Status */}
                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Recipients ({contract.recipients.length})
                  </p>
                  <div className="space-y-2">
                    {contract.recipients.map((recipient) => (
                      <div
                        key={recipient.id}
                        className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                            {recipient.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{recipient.name}</p>
                            <p className="text-xs text-gray-500">{recipient.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {recipient.viewedAt && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              Viewed
                            </span>
                          )}
                          <Badge
                            variant={recipient.status === 'signed' ? 'default' : 'secondary'}
                            className={recipient.status === 'signed' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {recipient.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
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
