import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate, getStatusColor } from '@/lib/utils'
import {
  FileText,
  Plus,
  Send,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  if (!user) return null

  // Fetch stats
  const [totalContracts, pendingContracts, completedContracts, recentContracts] = await Promise.all([
    prisma.contract.count({ where: { userId: user.id } }),
    prisma.contract.count({ where: { userId: user.id, status: 'pending' } }),
    prisma.contract.count({ where: { userId: user.id, status: 'completed' } }),
    prisma.contract.findMany({
      where: { userId: user.id },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        recipients: { select: { name: true, email: true, status: true } },
        _count: { select: { signatures: true } },
      },
    }),
  ])

  const stats = [
    { name: 'Total Contracts', value: totalContracts, icon: FileText, color: 'bg-blue-500' },
    { name: 'Pending Signatures', value: pendingContracts, icon: Clock, color: 'bg-yellow-500' },
    { name: 'Completed', value: completedContracts, icon: CheckCircle, color: 'bg-green-500' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name || 'there'}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your contracts.
          </p>
        </div>
        <Link href="/dashboard/contracts/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Contract
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:border-indigo-200 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Start from Template
            </CardTitle>
            <CardDescription>
              Choose from professional templates for NDAs, service agreements, and more.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/templates">
              <Button variant="outline">
                Browse Templates
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-purple-200 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              AI-Generated Contract
            </CardTitle>
            <CardDescription>
              Let AI create a custom contract based on your requirements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/ai">
              <Button variant="outline">
                Generate with AI
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Contracts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Contracts</CardTitle>
            <CardDescription>Your latest contract activity</CardDescription>
          </div>
          <Link href="/dashboard/contracts">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentContracts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No contracts yet
              </h3>
              <p className="text-gray-600 mb-6">
                Create your first contract to get started.
              </p>
              <Link href="/dashboard/contracts/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Contract
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentContracts.map((contract) => (
                <Link
                  key={contract.id}
                  href={`/dashboard/contracts/${contract.id}`}
                  className="flex items-center justify-between py-4 hover:bg-gray-50 -mx-6 px-6 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{contract.title}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(contract.createdAt)}
                        {contract.recipients.length > 0 && (
                          <span> • {contract.recipients.length} recipient(s)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(contract.status)}>
                    {contract.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
