"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CLAUSE_LIBRARY } from '@/lib/ai'
import { Sparkles, Wand2, Copy, Check, Plus, FileText } from 'lucide-react'

const contractTypes = [
  { id: 'freelance', name: 'Freelance Agreement', description: 'For independent contractors and freelancers' },
  { id: 'nda', name: 'Non-Disclosure Agreement', description: 'Protect confidential information' },
  { id: 'service', name: 'Service Agreement', description: 'General service contracts' },
  { id: 'consulting', name: 'Consulting Agreement', description: 'For consulting engagements' },
  { id: 'partnership', name: 'Partnership Agreement', description: 'Business partnerships' },
  { id: 'employment', name: 'Employment Contract', description: 'Hiring agreements' },
]

export default function AiContractsPage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [copiedClause, setCopiedClause] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!selectedType) return

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          variables: { description },
        }),
      })

      const data = await response.json()
      if (data.content) {
        setGeneratedContent(data.content)
      }
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCreateContract = async () => {
    if (!generatedContent) return

    try {
      const response = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `AI Generated ${selectedType} Contract`,
          content: generatedContent,
        }),
      })

      const contract = await response.json()
      router.push(`/dashboard/contracts/${contract.id}`)
    } catch (error) {
      console.error('Failed to create contract:', error)
    }
  }

  const copyClause = (key: string, content: string) => {
    navigator.clipboard.writeText(content)
    setCopiedClause(key)
    setTimeout(() => setCopiedClause(null), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          AI Contract Generator
        </h1>
        <p className="text-gray-600 mt-1">
          Generate professional contracts with AI assistance.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Generator */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Contract</CardTitle>
              <CardDescription>
                Select a contract type and describe your needs.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {contractTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-3 rounded-lg border text-left transition-colors ${
                        selectedType === type.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <p className="font-medium text-sm">{type.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details (Optional)
                </label>
                <Textarea
                  placeholder="Describe the parties involved, specific terms you need, payment details, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!selectedType || isGenerating}
                loading={isGenerating}
                className="w-full"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Contract'}
              </Button>
            </CardContent>
          </Card>

          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Contract</span>
                  <Button onClick={handleCreateContract}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Contract
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose max-w-none text-sm border rounded-lg p-4 max-h-96 overflow-y-auto"
                  dangerouslySetInnerHTML={{ __html: generatedContent }}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* Clause Library */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Clause Library
              </CardTitle>
              <CardDescription>
                Pre-written clauses you can copy and use in your contracts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[700px] overflow-y-auto">
              {Object.entries(CLAUSE_LIBRARY).map(([key, clause]) => (
                <div
                  key={key}
                  className="p-4 border rounded-lg hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{clause.title}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyClause(key, clause.content)}
                    >
                      {copiedClause === key ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">{clause.content}</p>
                  <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {clause.category}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
