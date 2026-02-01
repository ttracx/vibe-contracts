import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PLANS } from '@/lib/stripe'
import { Check, Zap, ArrowRight } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600">
            Start for free, upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="border-2">
            <CardHeader className="text-center pb-8 pt-8">
              <CardTitle className="text-2xl">Free</CardTitle>
              <p className="text-gray-600 mt-2">Perfect for getting started</p>
              <div className="mt-4">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-4 mb-8">
                {PLANS.free.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Pro Plan */}
          <Card className="border-2 border-indigo-500 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <CardHeader className="text-center pb-8 pt-8">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                Pro
                <Zap className="w-5 h-5 text-yellow-500" />
              </CardTitle>
              <p className="text-gray-600 mt-2">For growing businesses</p>
              <div className="mt-4">
                <span className="text-5xl font-bold">$29</span>
                <span className="text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-4 mb-8">
                {PLANS.pro.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Check className="w-3 h-3 text-indigo-600" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button size="lg" className="w-full">
                  Start Pro Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'Are e-signatures legally binding?',
                a: 'Yes! Electronic signatures are legally binding in the US under the ESIGN Act and UETA, and in the EU under eIDAS. VibeContracts provides a complete audit trail for legal compliance.',
              },
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Absolutely. You can cancel your Pro subscription at any time. You\'ll continue to have access until the end of your billing period.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards including Visa, Mastercard, American Express, and Discover through our secure payment processor, Stripe.',
              },
              {
                q: 'Is there a limit on document size?',
                a: 'Each document can be up to 10MB. For the Pro plan, there\'s no limit on the number of documents or signatures.',
              },
              {
                q: 'Do you offer team plans?',
                a: 'We\'re working on team and enterprise plans. Contact us if you need a solution for your organization.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
