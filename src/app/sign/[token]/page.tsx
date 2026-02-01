"use client"

import { useState, useEffect, use } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SignaturePadComponent } from '@/components/signature-pad'
import { Badge } from '@/components/ui/badge'
import { FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface ContractData {
  recipient: {
    id: string
    name: string
    email: string
    role: string
    status: string
    hasSigned: boolean
  }
  contract: {
    id: string
    title: string
    content: string
    status: string
    sender: { name: string | null; company: string | null }
    recipients: { name: string; email: string; status: string }[]
  }
}

export default function SignContractPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = use(params)
  const [data, setData] = useState<ContractData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSignature, setShowSignature] = useState(false)
  const [isSigning, setIsSigning] = useState(false)
  const [signed, setSigned] = useState(false)

  useEffect(() => {
    async function fetchContract() {
      try {
        const response = await fetch(`/api/sign/${token}`)
        if (!response.ok) {
          const errorData = await response.json()
          setError(errorData.error || 'Failed to load contract')
          return
        }
        const contractData = await response.json()
        setData(contractData)
        if (contractData.recipient.hasSigned) {
          setSigned(true)
        }
      } catch (err) {
        setError('Failed to load contract')
      } finally {
        setIsLoading(false)
      }
    }

    fetchContract()
  }, [token])

  const handleSign = async (signature: string, type: 'draw' | 'type') => {
    setIsSigning(true)
    try {
      const response = await fetch(`/api/sign/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signature, type }),
      })

      if (response.ok) {
        setSigned(true)
        setShowSignature(false)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to submit signature')
      }
    } catch (err) {
      alert('Failed to submit signature')
    } finally {
      setIsSigning(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading contract...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Contract
            </h2>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  if (signed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Successfully Signed!
            </h2>
            <p className="text-gray-600 mb-6">
              You have successfully signed &quot;{data.contract.title}&quot;.
              A copy will be sent to your email.
            </p>
            <p className="text-sm text-gray-500">
              You can close this window now.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">{data.contract.title}</h1>
              <p className="text-sm text-gray-500">
                From {data.contract.sender.name || data.contract.sender.company || 'Unknown'}
              </p>
            </div>
          </div>
          <Badge className="bg-yellow-100 text-yellow-800">
            Pending Your Signature
          </Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contract Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div
                  className="prose max-w-none contract-content"
                  dangerouslySetInnerHTML={{ __html: data.contract.content }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sign Document</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Hi {data.recipient.name}, please review the contract and sign below.
                </p>
                {showSignature ? (
                  <SignaturePadComponent
                    onSave={handleSign}
                    onCancel={() => setShowSignature(false)}
                  />
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => setShowSignature(true)}
                  >
                    Sign Now
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Signers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.contract.recipients.map((r, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-medium">{r.name}</p>
                        <p className="text-gray-500">{r.email}</p>
                      </div>
                      <Badge
                        variant={r.status === 'signed' ? 'default' : 'secondary'}
                        className={r.status === 'signed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {r.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
