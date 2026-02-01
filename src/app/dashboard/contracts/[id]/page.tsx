import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AuditTrail } from '@/components/audit-trail'
import { formatDate, formatDateTime, getStatusColor } from '@/lib/utils'
import { ArrowLeft, Send, Download, Edit, Clock, User, FileText } from 'lucide-react'

export default async function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getCurrentUser()
  if (!user) return null

  const contract = await prisma.contract.findFirst({
    where: { id, userId: user.id },
    include: {
      template: true,
      recipients: {
        include: { signatures: true },
        orderBy: { order: 'asc' },
      },
      auditLogs: {
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!contract) {
    notFound()
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/contracts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{contract.title}</h1>
              <Badge className={getStatusColor(contract.status)}>{contract.status}</Badge>
            </div>
            <p className="text-gray-600 mt-1">
              Created {formatDate(contract.createdAt)}
              {contract.template && ` • Based on ${contract.template.name}`}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          {contract.status === 'draft' && (
            <>
              <Link href={`/dashboard/contracts/${id}/edit`}>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <Link href={`/dashboard/contracts/${id}/send`}>
                <Button>
                  <Send className="w-4 h-4 mr-2" />
                  Send for Signature
                </Button>
              </Link>
            </>
          )}
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="preview">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            </TabsList>

            <TabsContent value="preview">
              <Card>
                <CardContent className="p-6">
                  <div
                    className="prose max-w-none contract-content"
                    dangerouslySetInnerHTML={{ __html: contract.content }}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit">
              <Card>
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                </CardHeader>
                <CardContent>
                  <AuditTrail logs={contract.auditLogs} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  contract.status === 'completed' ? 'bg-green-500' :
                  contract.status === 'pending' ? 'bg-yellow-500' :
                  contract.status === 'draft' ? 'bg-gray-400' : 'bg-red-500'
                }`} />
                <span className="capitalize font-medium">{contract.status}</span>
              </div>
              
              {contract.expiresAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  Expires {formatDateTime(contract.expiresAt)}
                </div>
              )}

              {contract.completedAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="w-4 h-4" />
                  Completed {formatDateTime(contract.completedAt)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recipients Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recipients</CardTitle>
            </CardHeader>
            <CardContent>
              {contract.recipients.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No recipients added yet. Send this contract to add recipients.
                </p>
              ) : (
                <div className="space-y-3">
                  {contract.recipients.map((recipient) => (
                    <div
                      key={recipient.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{recipient.name}</p>
                          <p className="text-xs text-gray-500">{recipient.email}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(recipient.status)} variant="secondary">
                        {recipient.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
