import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CONTRACT_TEMPLATES } from '@/lib/templates'
import { FileText, ArrowRight, Plus } from 'lucide-react'

const categoryLabels: Record<string, string> = {
  freelance: 'Freelance',
  nda: 'NDA',
  service: 'Services',
  consulting: 'Consulting',
  general: 'General',
}

const categoryColors: Record<string, string> = {
  freelance: 'bg-blue-100 text-blue-700',
  nda: 'bg-purple-100 text-purple-700',
  service: 'bg-green-100 text-green-700',
  consulting: 'bg-orange-100 text-orange-700',
  general: 'bg-gray-100 text-gray-700',
}

export default function TemplatesPage() {
  const categories = [...new Set(CONTRACT_TEMPLATES.map((t) => t.category))]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contract Templates</h1>
          <p className="text-gray-600 mt-1">
            Choose from professional, lawyer-approved templates.
          </p>
        </div>
        <Link href="/dashboard/contracts/new">
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create Custom
          </Button>
        </Link>
      </div>

      {categories.map((category) => (
        <div key={category}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
            {categoryLabels[category] || category} Templates
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONTRACT_TEMPLATES.filter((t) => t.category === category).map((template) => (
              <Card
                key={template.id}
                className="hover:border-indigo-300 transition-colors group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        categoryColors[template.category] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {categoryLabels[template.category] || template.category}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-4">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {template.variables.length} fields
                    </span>
                    <Link href={`/dashboard/contracts/new?template=${template.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group-hover:bg-indigo-50 group-hover:text-indigo-600"
                      >
                        Use Template
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
