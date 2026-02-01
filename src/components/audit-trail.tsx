"use client"

import { formatDateTime } from '@/lib/utils'
import { 
  FileText, 
  Eye, 
  Send, 
  CheckCircle, 
  Download, 
  Edit, 
  UserPlus,
  XCircle
} from 'lucide-react'

interface AuditLog {
  id: string
  action: string
  details: Record<string, unknown>
  ipAddress: string | null
  userAgent: string | null
  createdAt: string
  user?: { name: string | null; email: string | null } | null
}

interface AuditTrailProps {
  logs: AuditLog[]
}

const actionIcons: Record<string, React.ElementType> = {
  created: FileText,
  viewed: Eye,
  sent: Send,
  signed: CheckCircle,
  completed: CheckCircle,
  downloaded: Download,
  edited: Edit,
  recipient_added: UserPlus,
  declined: XCircle,
}

const actionLabels: Record<string, string> = {
  created: 'Contract created',
  viewed: 'Contract viewed',
  sent: 'Sent for signature',
  signed: 'Contract signed',
  completed: 'Contract completed',
  downloaded: 'Contract downloaded',
  edited: 'Contract edited',
  recipient_added: 'Recipient added',
  declined: 'Signature declined',
}

export function AuditTrail({ logs }: AuditTrailProps) {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {logs.map((log, idx) => {
          const Icon = actionIcons[log.action] || FileText
          const isLast = idx === logs.length - 1
          
          return (
            <li key={log.id}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center ring-8 ring-white">
                      <Icon className="h-4 w-4 text-indigo-600" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-900">
                        {actionLabels[log.action] || log.action}
                        {log.user && (
                          <span className="font-medium text-gray-600">
                            {' '}by {log.user.name || log.user.email}
                          </span>
                        )}
                      </p>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <p className="mt-0.5 text-xs text-gray-500">
                          {JSON.stringify(log.details)}
                        </p>
                      )}
                      {log.ipAddress && (
                        <p className="mt-0.5 text-xs text-gray-400">
                          IP: {log.ipAddress}
                        </p>
                      )}
                    </div>
                    <div className="whitespace-nowrap text-right text-xs text-gray-500">
                      {formatDateTime(log.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
