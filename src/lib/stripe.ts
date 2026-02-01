import Stripe from 'stripe'

// Only initialize Stripe if the key is available
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    })
  : null

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    contracts: 3,
    templates: 5,
    signatures: 10,
    features: [
      '3 contracts per month',
      '5 templates',
      '10 signatures per month',
      'Basic audit trail',
      'Email support'
    ]
  },
  pro: {
    name: 'Pro',
    price: 29,
    priceId: process.env.STRIPE_PRICE_ID,
    contracts: -1, // unlimited
    templates: -1,
    signatures: -1,
    features: [
      'Unlimited contracts',
      'Unlimited templates',
      'Unlimited signatures',
      'Full audit trail with PDF export',
      'AI clause suggestions',
      'Custom branding',
      'Priority support',
      'API access'
    ]
  }
}

export async function createCheckoutSession(userId: string, email: string) {
  if (!stripe) throw new Error('Stripe is not configured')
  
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: PLANS.pro.priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    metadata: {
      userId,
    },
  })

  return session
}

export async function createBillingPortalSession(customerId: string) {
  if (!stripe) throw new Error('Stripe is not configured')
  
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  })

  return session
}
