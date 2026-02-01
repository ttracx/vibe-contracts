export interface TemplateVariable {
  name: string
  label: string
  type: 'text' | 'date' | 'number' | 'textarea' | 'email'
  placeholder?: string
  required?: boolean
}

export interface ContractTemplate {
  id: string
  name: string
  description: string
  category: string
  variables: TemplateVariable[]
  content: string
}

export const CONTRACT_TEMPLATES: ContractTemplate[] = [
  {
    id: 'freelance-agreement',
    name: 'Freelance Service Agreement',
    description: 'Standard agreement for freelance services between a freelancer and client.',
    category: 'freelance',
    variables: [
      { name: 'freelancer_name', label: 'Freelancer Name', type: 'text', required: true },
      { name: 'freelancer_address', label: 'Freelancer Address', type: 'textarea', required: true },
      { name: 'client_name', label: 'Client Name', type: 'text', required: true },
      { name: 'client_address', label: 'Client Address', type: 'textarea', required: true },
      { name: 'project_description', label: 'Project Description', type: 'textarea', required: true },
      { name: 'deliverables', label: 'Deliverables', type: 'textarea', required: true },
      { name: 'start_date', label: 'Start Date', type: 'date', required: true },
      { name: 'end_date', label: 'End Date', type: 'date', required: true },
      { name: 'total_fee', label: 'Total Fee ($)', type: 'number', required: true },
      { name: 'payment_schedule', label: 'Payment Schedule', type: 'textarea', required: true },
    ],
    content: `<h1 style="text-align: center;">FREELANCE SERVICE AGREEMENT</h1>

<p><strong>Effective Date:</strong> {{start_date}}</p>

<h2>PARTIES</h2>

<p>This Freelance Service Agreement ("Agreement") is entered into between:</p>

<p><strong>Service Provider ("Freelancer"):</strong><br>
{{freelancer_name}}<br>
{{freelancer_address}}</p>

<p><strong>Client:</strong><br>
{{client_name}}<br>
{{client_address}}</p>

<h2>1. SCOPE OF WORK</h2>

<p>The Freelancer agrees to provide the following services:</p>

<p>{{project_description}}</p>

<h3>Deliverables:</h3>
<p>{{deliverables}}</p>

<h2>2. TIMELINE</h2>

<p><strong>Project Start Date:</strong> {{start_date}}<br>
<strong>Project End Date:</strong> {{end_date}}</p>

<h2>3. COMPENSATION</h2>

<p><strong>Total Fee:</strong> \${{total_fee}}</p>

<p><strong>Payment Schedule:</strong><br>
{{payment_schedule}}</p>

<p>Payment shall be made within 30 days of invoice receipt. Late payments will incur a 1.5% monthly interest charge.</p>

<h2>4. INTELLECTUAL PROPERTY</h2>

<p>Upon full payment, all deliverables and related intellectual property rights shall be transferred to the Client. The Freelancer retains the right to display completed work in their portfolio.</p>

<h2>5. CONFIDENTIALITY</h2>

<p>Both parties agree to keep confidential any proprietary information disclosed during the course of this engagement. This obligation survives the termination of this Agreement.</p>

<h2>6. REVISIONS</h2>

<p>This Agreement includes up to two (2) rounds of revisions. Additional revisions will be billed at the Freelancer's hourly rate.</p>

<h2>7. TERMINATION</h2>

<p>Either party may terminate this Agreement with 14 days written notice. Upon termination, the Client shall pay for all work completed to date.</p>

<h2>8. INDEPENDENT CONTRACTOR</h2>

<p>The Freelancer is an independent contractor and not an employee of the Client. The Freelancer is responsible for their own taxes and benefits.</p>

<h2>9. LIMITATION OF LIABILITY</h2>

<p>The Freelancer's liability shall not exceed the total fees paid under this Agreement.</p>

<h2>10. GOVERNING LAW</h2>

<p>This Agreement shall be governed by and construed in accordance with the laws of the state in which the Client is located.</p>

<h2>SIGNATURES</h2>

<div style="margin-top: 40px;">
<p><strong>Freelancer:</strong></p>
<p>Signature: _________________________ Date: _________</p>
<p>Print Name: {{freelancer_name}}</p>
</div>

<div style="margin-top: 40px;">
<p><strong>Client:</strong></p>
<p>Signature: _________________________ Date: _________</p>
<p>Print Name: {{client_name}}</p>
</div>`
  },
  {
    id: 'nda-mutual',
    name: 'Mutual Non-Disclosure Agreement',
    description: 'Two-way NDA for sharing confidential information between parties.',
    category: 'nda',
    variables: [
      { name: 'party_a_name', label: 'First Party Name', type: 'text', required: true },
      { name: 'party_a_address', label: 'First Party Address', type: 'textarea', required: true },
      { name: 'party_b_name', label: 'Second Party Name', type: 'text', required: true },
      { name: 'party_b_address', label: 'Second Party Address', type: 'textarea', required: true },
      { name: 'purpose', label: 'Purpose of Disclosure', type: 'textarea', required: true },
      { name: 'effective_date', label: 'Effective Date', type: 'date', required: true },
      { name: 'term_years', label: 'Term (Years)', type: 'number', required: true },
    ],
    content: `<h1 style="text-align: center;">MUTUAL NON-DISCLOSURE AGREEMENT</h1>

<p><strong>Effective Date:</strong> {{effective_date}}</p>

<h2>PARTIES</h2>

<p>This Mutual Non-Disclosure Agreement ("Agreement") is entered into by and between:</p>

<p><strong>Party A:</strong><br>
{{party_a_name}}<br>
{{party_a_address}}</p>

<p><strong>Party B:</strong><br>
{{party_b_name}}<br>
{{party_b_address}}</p>

<p>(each a "Party" and collectively the "Parties")</p>

<h2>1. PURPOSE</h2>

<p>The Parties wish to explore a business opportunity of mutual interest regarding:</p>

<p>{{purpose}}</p>

<p>In connection with this opportunity, each Party may disclose Confidential Information to the other Party.</p>

<h2>2. DEFINITION OF CONFIDENTIAL INFORMATION</h2>

<p>"Confidential Information" means any and all non-public information, including but not limited to:</p>
<ul>
<li>Trade secrets and proprietary information</li>
<li>Business plans and strategies</li>
<li>Financial information and projections</li>
<li>Customer and supplier lists</li>
<li>Technical data and specifications</li>
<li>Software, algorithms, and source code</li>
<li>Marketing plans and research</li>
</ul>

<h2>3. OBLIGATIONS</h2>

<p>Each Party agrees to:</p>
<ul>
<li>Keep all Confidential Information strictly confidential</li>
<li>Use Confidential Information only for the stated Purpose</li>
<li>Not disclose Confidential Information to third parties without prior written consent</li>
<li>Protect Confidential Information with the same degree of care used to protect its own confidential information</li>
<li>Limit access to Confidential Information to employees with a need to know</li>
</ul>

<h2>4. EXCLUSIONS</h2>

<p>Confidential Information does not include information that:</p>
<ul>
<li>Is or becomes publicly available through no fault of the receiving Party</li>
<li>Was known to the receiving Party prior to disclosure</li>
<li>Is independently developed by the receiving Party</li>
<li>Is disclosed pursuant to a legal requirement</li>
</ul>

<h2>5. TERM</h2>

<p>This Agreement shall remain in effect for {{term_years}} years from the Effective Date. The confidentiality obligations shall survive termination for an additional five (5) years.</p>

<h2>6. RETURN OF MATERIALS</h2>

<p>Upon request or termination of this Agreement, each Party shall return or destroy all Confidential Information received from the other Party.</p>

<h2>7. NO LICENSE</h2>

<p>Nothing in this Agreement grants any rights to any Party's intellectual property, patents, trademarks, or copyrights.</p>

<h2>8. GOVERNING LAW</h2>

<p>This Agreement shall be governed by the laws of the state in which Party A is located.</p>

<h2>SIGNATURES</h2>

<div style="margin-top: 40px;">
<p><strong>Party A:</strong></p>
<p>Signature: _________________________ Date: _________</p>
<p>Print Name: {{party_a_name}}</p>
</div>

<div style="margin-top: 40px;">
<p><strong>Party B:</strong></p>
<p>Signature: _________________________ Date: _________</p>
<p>Print Name: {{party_b_name}}</p>
</div>`
  },
  {
    id: 'service-agreement',
    name: 'Service Agreement',
    description: 'General agreement for providing professional services.',
    category: 'service',
    variables: [
      { name: 'provider_name', label: 'Service Provider Name', type: 'text', required: true },
      { name: 'provider_address', label: 'Provider Address', type: 'textarea', required: true },
      { name: 'client_name', label: 'Client Name', type: 'text', required: true },
      { name: 'client_address', label: 'Client Address', type: 'textarea', required: true },
      { name: 'services', label: 'Description of Services', type: 'textarea', required: true },
      { name: 'start_date', label: 'Start Date', type: 'date', required: true },
      { name: 'monthly_fee', label: 'Monthly Fee ($)', type: 'number', required: true },
      { name: 'notice_period', label: 'Termination Notice (Days)', type: 'number', required: true },
    ],
    content: `<h1 style="text-align: center;">SERVICE AGREEMENT</h1>

<p><strong>Effective Date:</strong> {{start_date}}</p>

<h2>PARTIES</h2>

<p><strong>Service Provider:</strong><br>
{{provider_name}}<br>
{{provider_address}}</p>

<p><strong>Client:</strong><br>
{{client_name}}<br>
{{client_address}}</p>

<h2>1. SERVICES</h2>

<p>The Service Provider agrees to provide the following services ("Services"):</p>

<p>{{services}}</p>

<h2>2. TERM</h2>

<p>This Agreement shall commence on {{start_date}} and continue on a month-to-month basis until terminated by either party.</p>

<h2>3. COMPENSATION</h2>

<p><strong>Monthly Fee:</strong> \${{monthly_fee}}</p>

<p>Payment is due on the first of each month. Invoices will be sent 7 days prior to the due date.</p>

<h2>4. SERVICE STANDARDS</h2>

<p>The Service Provider agrees to:</p>
<ul>
<li>Perform all Services in a professional and workmanlike manner</li>
<li>Respond to Client inquiries within 24 business hours</li>
<li>Provide regular progress updates as agreed upon</li>
<li>Maintain industry-standard security practices</li>
</ul>

<h2>5. CLIENT RESPONSIBILITIES</h2>

<p>The Client agrees to:</p>
<ul>
<li>Provide timely access to necessary information and resources</li>
<li>Make decisions and provide feedback in a timely manner</li>
<li>Pay all invoices according to the agreed payment terms</li>
</ul>

<h2>6. CONFIDENTIALITY</h2>

<p>Both parties agree to maintain the confidentiality of all non-public information shared during the course of this engagement.</p>

<h2>7. TERMINATION</h2>

<p>Either party may terminate this Agreement with {{notice_period}} days written notice. Upon termination, the Client shall pay for all Services rendered through the termination date.</p>

<h2>8. LIMITATION OF LIABILITY</h2>

<p>The Service Provider's liability shall not exceed the fees paid by the Client in the preceding three (3) months.</p>

<h2>9. ENTIRE AGREEMENT</h2>

<p>This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations and agreements.</p>

<h2>SIGNATURES</h2>

<div style="margin-top: 40px;">
<p><strong>Service Provider:</strong></p>
<p>Signature: _________________________ Date: _________</p>
<p>Print Name: {{provider_name}}</p>
</div>

<div style="margin-top: 40px;">
<p><strong>Client:</strong></p>
<p>Signature: _________________________ Date: _________</p>
<p>Print Name: {{client_name}}</p>
</div>`
  },
  {
    id: 'consulting-agreement',
    name: 'Consulting Agreement',
    description: 'Agreement for consulting services with hourly or project-based billing.',
    category: 'consulting',
    variables: [
      { name: 'consultant_name', label: 'Consultant Name', type: 'text', required: true },
      { name: 'consultant_address', label: 'Consultant Address', type: 'textarea', required: true },
      { name: 'client_name', label: 'Client Name', type: 'text', required: true },
      { name: 'client_address', label: 'Client Address', type: 'textarea', required: true },
      { name: 'scope', label: 'Scope of Consulting Services', type: 'textarea', required: true },
      { name: 'hourly_rate', label: 'Hourly Rate ($)', type: 'number', required: true },
      { name: 'retainer', label: 'Monthly Retainer Hours', type: 'number', required: false },
      { name: 'start_date', label: 'Start Date', type: 'date', required: true },
    ],
    content: `<h1 style="text-align: center;">CONSULTING AGREEMENT</h1>

<p><strong>Effective Date:</strong> {{start_date}}</p>

<h2>PARTIES</h2>

<p><strong>Consultant:</strong><br>
{{consultant_name}}<br>
{{consultant_address}}</p>

<p><strong>Client:</strong><br>
{{client_name}}<br>
{{client_address}}</p>

<h2>1. ENGAGEMENT</h2>

<p>The Client hereby engages the Consultant to provide consulting services as described herein.</p>

<h2>2. SCOPE OF SERVICES</h2>

<p>{{scope}}</p>

<h2>3. COMPENSATION</h2>

<p><strong>Hourly Rate:</strong> \${{hourly_rate}} per hour</p>

<p>The Consultant shall submit detailed time records with each invoice. Payment is due within 30 days of invoice date.</p>

<h2>4. EXPENSES</h2>

<p>The Client shall reimburse the Consultant for pre-approved reasonable business expenses incurred in connection with the Services.</p>

<h2>5. INDEPENDENT CONTRACTOR</h2>

<p>The Consultant is an independent contractor and not an employee, partner, or joint venturer of the Client.</p>

<h2>6. CONFIDENTIALITY</h2>

<p>The Consultant agrees to maintain strict confidentiality of all Client information and shall not disclose such information without prior written consent.</p>

<h2>7. WORK PRODUCT</h2>

<p>All work product developed by the Consultant specifically for the Client shall be the property of the Client upon full payment.</p>

<h2>8. NON-COMPETE</h2>

<p>During the term of this Agreement and for six (6) months thereafter, the Consultant agrees not to provide similar services to direct competitors of the Client without prior written consent.</p>

<h2>9. TERMINATION</h2>

<p>Either party may terminate this Agreement with 30 days written notice. The Client shall pay for all Services rendered through the termination date.</p>

<h2>10. GOVERNING LAW</h2>

<p>This Agreement shall be governed by the laws of the state in which the Client's principal place of business is located.</p>

<h2>SIGNATURES</h2>

<div style="margin-top: 40px;">
<p><strong>Consultant:</strong></p>
<p>Signature: _________________________ Date: _________</p>
<p>Print Name: {{consultant_name}}</p>
</div>

<div style="margin-top: 40px;">
<p><strong>Client:</strong></p>
<p>Signature: _________________________ Date: _________</p>
<p>Print Name: {{client_name}}</p>
</div>`
  },
  {
    id: 'simple-contract',
    name: 'Simple Contract',
    description: 'Basic two-party agreement for simple transactions.',
    category: 'general',
    variables: [
      { name: 'party_a', label: 'First Party Name', type: 'text', required: true },
      { name: 'party_b', label: 'Second Party Name', type: 'text', required: true },
      { name: 'agreement_details', label: 'Agreement Details', type: 'textarea', required: true },
      { name: 'effective_date', label: 'Effective Date', type: 'date', required: true },
    ],
    content: `<h1 style="text-align: center;">CONTRACT AGREEMENT</h1>

<p><strong>Effective Date:</strong> {{effective_date}}</p>

<h2>PARTIES</h2>

<p>This Agreement is entered into between <strong>{{party_a}}</strong> ("First Party") and <strong>{{party_b}}</strong> ("Second Party").</p>

<h2>AGREEMENT</h2>

<p>{{agreement_details}}</p>

<h2>TERMS</h2>

<p>Both parties agree to fulfill their respective obligations as outlined above in good faith and in a timely manner.</p>

<h2>GENERAL PROVISIONS</h2>

<p><strong>Entire Agreement:</strong> This document constitutes the entire agreement between the parties.</p>

<p><strong>Amendments:</strong> Any changes to this Agreement must be in writing and signed by both parties.</p>

<p><strong>Severability:</strong> If any provision is found invalid, the remaining provisions shall remain in effect.</p>

<h2>SIGNATURES</h2>

<div style="margin-top: 40px;">
<p><strong>First Party:</strong></p>
<p>Signature: _________________________ Date: _________</p>
<p>Print Name: {{party_a}}</p>
</div>

<div style="margin-top: 40px;">
<p><strong>Second Party:</strong></p>
<p>Signature: _________________________ Date: _________</p>
<p>Print Name: {{party_b}}</p>
</div>`
  }
]

export function getTemplateById(id: string): ContractTemplate | undefined {
  return CONTRACT_TEMPLATES.find(t => t.id === id)
}

export function getTemplatesByCategory(category: string): ContractTemplate[] {
  return CONTRACT_TEMPLATES.filter(t => t.category === category)
}

export function fillTemplate(template: string, variables: Record<string, string>): string {
  let content = template
  for (const [key, value] of Object.entries(variables)) {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value || `[${key}]`)
  }
  return content
}
