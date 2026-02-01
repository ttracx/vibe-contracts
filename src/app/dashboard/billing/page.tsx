import { getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PLANS } from '@/lib/stripe'
import { formatDate } from '@/lib/utils'
import { CreditCard, Check, Zap, ArrowRight } from 'lucide-react'

export default async function BillingPage() {
  const user = await getCurrentUser()
  if (!user) return null

  const currentPlan = user.subscription?.plan || 'free'
  const isActive = user.subscription?.status === 'active'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-600 mt-1">Manage your subscription and payment methods.</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                You are currently on the{' '}
                <span className="font-semibold capitalize">{currentPlan}</span> plan.
              </CardDescription>
            </div>
            <Badge variant={isActive ? 'default' : 'secondary'}>
              {isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {user.subscription?.stripeCurrentPeriodEnd && (
            <p className="text-sm text-gray-500 mb-4">
              Your subscription renews on{' '}
              {formatDate(user.subscription.stripeCurrentPeriodEnd)}
            </p>
          )}
          {currentPlan === 'pro' && (
            <Button variant="outline">
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Billing
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <Card className={currentPlan === 'free' ? 'border-indigo-500' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Free</CardTitle>
              {currentPlan === 'free' && (
                <Badge>Current Plan</Badge>
              )}
            </div>
            <div className="mt-2">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-gray-500">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {PLANS.free.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            {currentPlan !== 'free' && (
              <Button variant="outline" className="w-full">
                Downgrade to Free
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className={`${currentPlan === 'pro' ? 'border-indigo-500' : ''} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-medium px-3 py-1">
            Popular
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                Pro
                <Zap className="w-5 h-5 text-yellow-500" />
              </CardTitle>
              {currentPlan === 'pro' && (
                <Badge>Current Plan</Badge>
              )}
            </div>
            <div className="mt-2">
              <span className="text-3xl font-bold">$29</span>
              <span className="text-gray-500">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              {PLANS.pro.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
            {currentPlan !== 'pro' && (
              <form action="/api/stripe/checkout" method="POST">
                <Button className="w-full">
                  Upgrade to Pro
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>View your past invoices and payments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No payment history yet.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
