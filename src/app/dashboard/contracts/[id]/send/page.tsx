"use client"

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Trash2, Send, User } from 'lucide-react'

interface Recipient {
  name: string
  email: string
  role: string
}

export default function SendContractPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [recipients, setRecipients] = useState<Recipient[]>([
    { name: '', email: '', role: 'signer' },
  ])
  const [message, setMessage] = useState(
    "Please review and sign this contract at your earliest convenience."
  )
  const [expiresInDays, setExpiresInDays] = useState(30)
  const [isLoading, setIsLoading] = useState(false)

  const addRecipient = () => {
    setRecipients([...recipients, { name: '', email: '', role: 'signer' }])
  }

  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter((_, i) => i !== index))
    }
  }

  const updateRecipient = (index: number, field: keyof Recipient, value: string) => {
    const updated = [...recipients]
    updated[index] = { ...updated[index], [field]: value }
    setRecipients(updated)
  }

  const handleSend = async () => {
    // Validate
    const validRecipients = recipients.filter((r) => r.name && r.email)
    if (validRecipients.length === 0) {
      alert('Please add at least one recipient')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/contracts/${id}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients: validRecipients,
          message,
          expiresInDays,
        }),
      })

      if (response.ok) {
        router.push(`/dashboard/contracts/${id}?sent=true`)
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to send contract')
      }
    } catch (error) {
      console.error('Failed to send:', error)
      alert('Failed to send contract')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/contracts/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Send for Signature</h1>
          <p className="text-gray-600">Add recipients who need to sign this contract.</p>
        </div>
      </div>

      {/* Recipients */}
      <Card>
        <CardHeader>
          <CardTitle>Recipients</CardTitle>
          <CardDescription>
            Add the people who need to review and sign this contract.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recipients.map((recipient, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3">
                <Input
                  placeholder="Full name"
                  value={recipient.name}
                  onChange={(e) => updateRecipient(index, 'name', e.target.value)}
                />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={recipient.email}
                  onChange={(e) => updateRecipient(index, 'email', e.target.value)}
                />
              </div>
              {recipients.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRecipient(index)}
                  className="shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
          ))}

          <Button variant="outline" onClick={addRecipient} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Another Recipient
          </Button>
        </CardContent>
      </Card>

      {/* Message */}
      <Card>
        <CardHeader>
          <CardTitle>Email Message</CardTitle>
          <CardDescription>
            This message will be included in the email sent to recipients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter a message for the recipients..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle>Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700">Contract expires in</label>
            <Input
              type="number"
              value={expiresInDays}
              onChange={(e) => setExpiresInDays(parseInt(e.target.value) || 30)}
              className="w-20"
              min={1}
              max={365}
            />
            <span className="text-sm text-gray-700">days</span>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Link href={`/dashboard/contracts/${id}`}>
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleSend} loading={isLoading}>
          <Send className="w-4 h-4 mr-2" />
          Send Contract
        </Button>
      </div>
    </div>
  )
}
