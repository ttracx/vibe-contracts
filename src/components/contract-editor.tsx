"use client"

import React, { useState, useCallback } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CLAUSE_LIBRARY } from '@/lib/ai'
import { Sparkles, Plus, Wand2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'

interface ContractEditorProps {
  content: string
  onChange: (content: string) => void
  readOnly?: boolean
}

export function ContractEditor({ content, onChange, readOnly = false }: ContractEditorProps) {
  const [showClauseLibrary, setShowClauseLibrary] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const insertClause = (clause: { title: string; content: string }) => {
    const newContent = content + `\n\n<h3>${clause.title}</h3>\n<p>${clause.content}</p>`
    onChange(newContent)
    setShowClauseLibrary(false)
  }

  const handleAiImprove = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await response.json()
      if (data.improved) {
        onChange(data.improved)
      }
    } catch (error) {
      console.error('Failed to improve:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex gap-2 flex-wrap">
          <Dialog open={showClauseLibrary} onOpenChange={setShowClauseLibrary}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Clause
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Clause Library</DialogTitle>
                <DialogDescription>
                  Select a pre-written clause to add to your contract
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 mt-4">
                {Object.entries(CLAUSE_LIBRARY).map(([key, clause]) => (
                  <Card
                    key={key}
                    className="cursor-pointer hover:border-indigo-500 transition-colors"
                    onClick={() => insertClause(clause)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{clause.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2">{clause.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            size="sm"
            onClick={handleAiImprove}
            disabled={isGenerating}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {isGenerating ? 'Improving...' : 'AI Improve'}
          </Button>
        </div>
      )}

      <div
        className={`min-h-[600px] border rounded-lg p-6 bg-white ${
          readOnly ? 'cursor-default' : 'cursor-text'
        }`}
        contentEditable={!readOnly}
        dangerouslySetInnerHTML={{ __html: content }}
        onBlur={(e) => {
          if (!readOnly) {
            onChange(e.currentTarget.innerHTML)
          }
        }}
        style={{
          fontFamily: 'Georgia, Times, serif',
          lineHeight: '1.6',
        }}
      />
    </div>
  )
}
