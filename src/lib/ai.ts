import OpenAI from 'openai'

// Only initialize OpenAI if the key is available
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null

export interface ClauseSuggestion {
  title: string
  content: string
  explanation: string
}

export async function generateClauseSuggestions(
  contractType: string,
  context: string
): Promise<ClauseSuggestion[]> {
  if (!openai) {
    // Return default suggestions when OpenAI is not configured
    return Object.values(CLAUSE_LIBRARY).slice(0, 3).map(clause => ({
      title: clause.title,
      content: clause.content,
      explanation: `Standard ${clause.category} clause for contracts.`
    }))
  }

  const prompt = `You are a legal contract expert. Generate 3 professional contract clause suggestions for a ${contractType} contract.

Context: ${context}

For each clause, provide:
1. A clear title
2. The full clause text (professionally worded, legally sound)
3. A brief explanation of why this clause is important

Respond in JSON format:
[
  {
    "title": "Clause Title",
    "content": "Full clause text...",
    "explanation": "Why this clause matters..."
  }
]`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })

    const result = JSON.parse(response.choices[0].message.content || '{"clauses": []}')
    return result.clauses || result || []
  } catch (error) {
    console.error('AI suggestion error:', error)
    return []
  }
}

export async function improveClause(clause: string): Promise<string> {
  if (!openai) {
    return clause
  }

  const prompt = `Improve this contract clause to be more professional, clear, and legally sound. Keep the same intent but enhance the language:

"${clause}"

Return only the improved clause text, nothing else.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    })

    return response.choices[0].message.content || clause
  } catch (error) {
    console.error('AI improve error:', error)
    return clause
  }
}

export async function generateContract(
  type: string,
  variables: Record<string, string>
): Promise<string> {
  if (!openai) {
    return `<h1>${type} Contract</h1>
<p>AI generation requires OpenAI API key. Please configure OPENAI_API_KEY in your environment variables.</p>
<p>In the meantime, you can use the built-in templates or create a contract from scratch.</p>`
  }

  const variableList = Object.entries(variables)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n')

  const prompt = `Generate a professional ${type} contract with the following details:

${variableList}

Create a complete, legally-sound contract with all necessary sections including:
- Parties involved
- Scope of work/agreement
- Terms and conditions
- Payment terms (if applicable)
- Confidentiality
- Termination clause
- Dispute resolution
- Signatures section

Format the contract in clean HTML with proper headings and paragraphs.`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4000,
    })

    return response.choices[0].message.content || ''
  } catch (error) {
    console.error('AI generate error:', error)
    throw new Error('Failed to generate contract')
  }
}

// Pre-built clause suggestions for quick access
export const CLAUSE_LIBRARY = {
  confidentiality: {
    title: 'Confidentiality Clause',
    content: `The Receiving Party agrees to hold all Confidential Information in strict confidence and not to disclose such information to any third parties without the prior written consent of the Disclosing Party. This obligation shall survive the termination of this Agreement for a period of five (5) years.`,
    category: 'confidentiality'
  },
  termination: {
    title: 'Termination Clause',
    content: `Either party may terminate this Agreement upon thirty (30) days written notice to the other party. Upon termination, all outstanding payments shall become immediately due and payable, and each party shall return or destroy all confidential materials belonging to the other party.`,
    category: 'termination'
  },
  payment: {
    title: 'Payment Terms',
    content: `Payment shall be due within thirty (30) days of invoice date. Late payments shall accrue interest at a rate of 1.5% per month. In the event of non-payment, the Service Provider reserves the right to suspend services until all outstanding amounts are paid in full.`,
    category: 'payment'
  },
  liability: {
    title: 'Limitation of Liability',
    content: `In no event shall either party be liable for any indirect, incidental, special, consequential, or punitive damages, regardless of the cause of action or whether such party has been advised of the possibility of such damages. The total liability of either party shall not exceed the total fees paid under this Agreement.`,
    category: 'liability'
  },
  indemnification: {
    title: 'Indemnification',
    content: `Each party agrees to indemnify and hold harmless the other party from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to any breach of this Agreement or any negligent or wrongful act or omission.`,
    category: 'indemnification'
  },
  intellectualProperty: {
    title: 'Intellectual Property Rights',
    content: `All intellectual property rights in any work product created by the Service Provider under this Agreement shall be assigned to the Client upon full payment. The Service Provider retains the right to use general skills, knowledge, and experience gained during the engagement.`,
    category: 'ip'
  },
  disputeResolution: {
    title: 'Dispute Resolution',
    content: `Any disputes arising from this Agreement shall first be attempted to be resolved through good faith negotiation. If negotiation fails, the parties agree to submit to binding arbitration under the rules of the American Arbitration Association. The arbitration shall take place in [City, State], and the decision shall be final and binding.`,
    category: 'dispute'
  },
  forceMajeure: {
    title: 'Force Majeure',
    content: `Neither party shall be liable for any failure or delay in performing their obligations under this Agreement if such failure or delay results from circumstances beyond the reasonable control of that party, including but not limited to acts of God, natural disasters, war, terrorism, riots, embargoes, or government actions.`,
    category: 'force_majeure'
  }
}
