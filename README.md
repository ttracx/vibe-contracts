# VibeContracts

AI-powered contract generator and e-signature platform for freelancers and small businesses.

## Features

- 📝 **Contract Templates** - Professional, lawyer-approved templates for NDAs, service agreements, freelance contracts, and more
- 🤖 **AI Clause Suggestions** - Get intelligent clause recommendations powered by AI
- ✍️ **E-Signatures** - Legally binding electronic signatures with full audit trail
- 📊 **Audit Trail** - Complete visibility into who viewed, signed, and when
- 💼 **Built for SMBs** - Perfect for freelancers and small businesses
- 💰 **Simple Pricing** - $29/month for unlimited contracts

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **AI**: OpenAI GPT-4
- **UI Components**: Radix UI

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vibe-contracts.git
cd vibe-contracts
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` - Stripe API keys
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `OPENAI_API_KEY` - OpenAI API key

4. Set up the database:
```bash
pnpm prisma migrate dev
pnpm prisma db seed  # Optional: seed with sample data
```

5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/vibe-contracts)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

### Database Setup

We recommend using:
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Supabase](https://supabase.com) - PostgreSQL with extras
- [Railway](https://railway.app) - Simple PostgreSQL hosting

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/             # API routes
│   ├── dashboard/       # Dashboard pages
│   ├── sign/            # Signing flow
│   └── ...
├── components/          # React components
│   └── ui/             # Reusable UI components
├── lib/                 # Utility functions
│   ├── auth.ts         # Authentication config
│   ├── db.ts           # Prisma client
│   ├── stripe.ts       # Stripe config
│   ├── ai.ts           # AI utilities
│   └── templates.ts    # Contract templates
└── types/              # TypeScript types
```

## Contract Templates

Built-in templates include:
- Freelance Service Agreement
- Mutual Non-Disclosure Agreement (NDA)
- Service Agreement
- Consulting Agreement
- Simple Contract

All templates support variable substitution for easy customization.

## E-Signature Flow

1. Create a contract from template or scratch
2. Add recipients (signers)
3. Send for signature via email
4. Recipients receive a unique signing link
5. They review and sign (draw or type signature)
6. Complete audit trail is recorded
7. All parties receive signed copy

## API Reference

### Contracts

- `GET /api/contracts` - List all contracts
- `POST /api/contracts` - Create new contract
- `GET /api/contracts/[id]` - Get contract details
- `PATCH /api/contracts/[id]` - Update contract
- `DELETE /api/contracts/[id]` - Delete contract
- `POST /api/contracts/[id]/send` - Send for signature

### Signing

- `GET /api/sign/[token]` - Get contract for signing
- `POST /api/sign/[token]` - Submit signature

### AI

- `POST /api/ai/suggest` - Get AI clause suggestions
- `POST /api/ai/improve` - Improve clause wording
- `POST /api/ai/generate` - Generate full contract

## License

MIT License - see LICENSE file for details.

## Support

- Email: support@vibecontracts.com
- Documentation: https://docs.vibecontracts.com
