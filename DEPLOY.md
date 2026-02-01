# Deploy VibeContracts to Vercel

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ttracx/vibe-contracts)

## Manual Deployment

### Option 1: Vercel Dashboard

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import from GitHub: `ttracx/vibe-contracts`
3. Add the following environment variables:

```
DATABASE_URL=postgresql://user:password@host:5432/vibecontracts
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-here

# OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...

# OpenAI (optional - for AI features)
OPENAI_API_KEY=sk-...

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

4. Click Deploy

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd ~/vibe-contracts
vercel --prod
```

## Database Setup

### Using Neon (Recommended)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it as `DATABASE_URL` in Vercel

### Using Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string (Transaction Pooler recommended)
4. Add it as `DATABASE_URL` in Vercel

### Run Migrations

After deploying, run migrations:

```bash
# With Vercel CLI connected
vercel env pull .env.local
npx prisma migrate deploy
```

Or use Prisma's hosted dashboard:
```bash
npx prisma studio
```

## Post-Deployment

1. Set up Stripe webhook at `https://your-domain/api/stripe/webhook`
2. Configure Google OAuth callback URL: `https://your-domain/api/auth/callback/google`
3. Test the login flow
4. Create your first contract!

## Features Ready Out of the Box

- ✅ User authentication (email/Google)
- ✅ Contract templates
- ✅ E-signature with draw/type options
- ✅ Full audit trail
- ✅ AI clause suggestions (requires OpenAI key)
- ✅ Stripe billing integration
- ✅ Mobile-responsive design

## Support

For issues, open a ticket on GitHub: https://github.com/ttracx/vibe-contracts/issues
