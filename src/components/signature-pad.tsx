"use client"

import React, { useRef, useEffect, useState } from 'react'
import SignaturePad from 'signature_pad'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Input } from './ui/input'
import { Eraser, Download, Check } from 'lucide-react'

interface SignaturePadComponentProps {
  onSave: (signature: string, type: 'draw' | 'type') => void
  onCancel?: () => void
}

export function SignaturePadComponent({ onSave, onCancel }: SignaturePadComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const signaturePadRef = useRef<SignaturePad | null>(null)
  const [typedName, setTypedName] = useState('')
  const [activeTab, setActiveTab] = useState('draw')

  useEffect(() => {
    if (canvasRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(0, 0, 0)',
      })

      const resizeCanvas = () => {
        if (canvasRef.current) {
          const ratio = Math.max(window.devicePixelRatio || 1, 1)
          canvasRef.current.width = canvasRef.current.offsetWidth * ratio
          canvasRef.current.height = canvasRef.current.offsetHeight * ratio
          canvasRef.current.getContext('2d')?.scale(ratio, ratio)
          signaturePadRef.current?.clear()
        }
      }

      resizeCanvas()
      window.addEventListener('resize', resizeCanvas)

      return () => {
        window.removeEventListener('resize', resizeCanvas)
      }
    }
  }, [])

  const handleClear = () => {
    signaturePadRef.current?.clear()
  }

  const handleSaveDrawn = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const dataUrl = signaturePadRef.current.toDataURL('image/png')
      onSave(dataUrl, 'draw')
    }
  }

  const handleSaveTyped = () => {
    if (typedName.trim()) {
      // Create a canvas and draw the typed name
      const canvas = document.createElement('canvas')
      canvas.width = 400
      canvas.height = 100
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = 'black'
        ctx.font = 'italic 36px "Dancing Script", cursive, serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(typedName, canvas.width / 2, canvas.height / 2)
        const dataUrl = canvas.toDataURL('image/png')
        onSave(dataUrl, 'type')
      }
    }
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="draw">Draw Signature</TabsTrigger>
          <TabsTrigger value="type">Type Signature</TabsTrigger>
        </TabsList>
        
        <TabsContent value="draw" className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white">
            <canvas
              ref={canvasRef}
              className="w-full h-40 cursor-crosshair touch-none"
              style={{ touchAction: 'none' }}
            />
          </div>
          <p className="text-sm text-gray-500 text-center">
            Draw your signature above using your mouse or touch screen
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClear} className="flex-1">
              <Eraser className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button onClick={handleSaveDrawn} className="flex-1">
              <Check className="w-4 h-4 mr-2" />
              Apply Signature
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="type" className="space-y-4">
          <div>
            <Input
              placeholder="Type your full legal name"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              className="text-lg"
            />
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg bg-white p-4 min-h-[100px] flex items-center justify-center">
            <span
              className="text-3xl text-gray-800"
              style={{ fontFamily: '"Dancing Script", cursive, serif', fontStyle: 'italic' }}
            >
              {typedName || 'Your signature will appear here'}
            </span>
          </div>
          <Button onClick={handleSaveTyped} disabled={!typedName.trim()} className="w-full">
            <Check className="w-4 h-4 mr-2" />
            Apply Signature
          </Button>
        </TabsContent>
      </Tabs>

      {onCancel && (
        <Button variant="ghost" onClick={onCancel} className="w-full mt-2">
          Cancel
        </Button>
      )}
    </div>
  )
}
