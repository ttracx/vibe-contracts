"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ContractEditor } from '@/components/contract-editor'
import { CONTRACT_TEMPLATES, fillTemplate } from '@/lib/templates'
import { ArrowLeft, FileText, Check } from 'lucide-react'

type Step = 'template' | 'variables' | 'editor'

export default function NewContractPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('template')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [variables, setVariables] = useState<Record<string, string>>({})
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const template = selectedTemplate
    ? CONTRACT_TEMPLATES.find((t) => t.id === selectedTemplate)
    : null

  const handleSelectTemplate = (templateId: string | null) => {
    if (templateId === null) {
      setSelectedTemplate(null)
      setTitle('Untitled Contract')
      setContent('<h1>Contract Agreement</h1>\n<p>Enter your contract content here...</p>')
      setStep('editor')
    } else {
      const t = CONTRACT_TEMPLATES.find((t) => t.id === templateId)
      if (t) {
        setSelectedTemplate(templateId)
        setTitle(t.name)
        setStep('variables')
      }
    }
  }

  const handleVariablesComplete = () => {
    if (template) {
      const filledContent = fillTemplate(template.content, variables)
      setContent(filledContent)
      setStep('editor')
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          templateId: selectedTemplate,
          variables,
        }),
      })

      if (response.ok) {
        const contract = await response.json()
        router.push(`/dashboard/contracts/${contract.id}`)
      }
    } catch (error) {
      console.error('Failed to save contract:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contracts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Contract</h1>
          <p className="text-gray-600">
            {step === 'template' && 'Choose a template or start from scratch'}
            {step === 'variables' && 'Fill in the contract details'}
            {step === 'editor' && 'Review and edit your contract'}
          </p>
        </div>
      </div>

      {/* Step 1: Template Selection */}
      {step === 'template' && (
        <div className="space-y-6">
          <Card
            className="cursor-pointer hover:border-indigo-500 transition-colors"
            onClick={() => handleSelectTemplate(null)}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Blank Contract</h3>
                <p className="text-sm text-gray-500">Start from scratch with a blank document</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {CONTRACT_TEMPLATES.map((t) => (
              <Card
                key={t.id}
                className="cursor-pointer hover:border-indigo-500 transition-colors"
                onClick={() => handleSelectTemplate(t.id)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{t.name}</CardTitle>
                  <CardDescription>{t.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    {t.category}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Variables */}
      {step === 'variables' && template && (
        <Card>
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
            <CardDescription>
              Fill in the details for your {template.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contract Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter contract title"
              />
            </div>
            
            {template.variables.map((v) => (
              <div key={v.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {v.label}
                  {v.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {v.type === 'textarea' ? (
                  <textarea
                    className="w-full border rounded-lg p-3 min-h-[100px]"
                    placeholder={v.placeholder}
                    value={variables[v.name] || ''}
                    onChange={(e) =>
                      setVariables((prev) => ({ ...prev, [v.name]: e.target.value }))
                    }
                  />
                ) : (
                  <Input
                    type={v.type}
                    placeholder={v.placeholder}
                    value={variables[v.name] || ''}
                    onChange={(e) =>
                      setVariables((prev) => ({ ...prev, [v.name]: e.target.value }))
                    }
                  />
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep('template')}>
                Back
              </Button>
              <Button onClick={handleVariablesComplete}>
                Continue to Editor
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Editor */}
      {step === 'editor' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl font-bold border-0 p-0 focus:ring-0"
                    placeholder="Contract Title"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(selectedTemplate ? 'variables' : 'template')}
                  >
                    Back
                  </Button>
                  <Button onClick={handleSave} loading={isLoading}>
                    <Check className="w-4 h-4 mr-2" />
                    Save Contract
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ContractEditor content={content} onChange={setContent} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
