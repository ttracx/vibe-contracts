import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Sparkles, 
  Shield, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Users,
  Lock,
  FileCheck,
  PenTool,
  BarChart3
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              AI-Powered Contract Generation
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-6">
              Create Professional Contracts{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                in Minutes
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              AI-powered contract generator with legally binding e-signatures. 
              Perfect for freelancers and small businesses who need professional 
              contracts without the legal fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="text-lg px-8 py-6">
                  Start Creating for Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Browse Templates
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              No credit card required • 3 free contracts per month
            </p>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-sm font-medium text-gray-500 mb-8">
            TRUSTED BY THOUSANDS OF FREELANCERS AND BUSINESSES
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-60">
            {['Stripe', 'Shopify', 'Slack', 'Notion', 'Figma', 'Linear'].map((name) => (
              <span key={name} className="text-xl font-bold text-gray-400">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Contract Management
            </h2>
            <p className="text-lg text-gray-600">
              From creation to signature, VibeContracts handles it all with 
              AI-powered intelligence and legally binding security.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: 'AI Clause Suggestions',
                description: 'Get intelligent clause recommendations based on your contract type and industry best practices.',
                color: 'indigo',
              },
              {
                icon: FileText,
                title: 'Professional Templates',
                description: 'Choose from dozens of lawyer-approved templates for NDAs, service agreements, and more.',
                color: 'purple',
              },
              {
                icon: PenTool,
                title: 'E-Signatures',
                description: 'Legally binding electronic signatures that are recognized and enforceable worldwide.',
                color: 'blue',
              },
              {
                icon: Shield,
                title: 'Audit Trail',
                description: 'Complete visibility into who viewed, signed, and when - all documented for legal compliance.',
                color: 'green',
              },
              {
                icon: Clock,
                title: 'Quick Turnaround',
                description: 'Send contracts and collect signatures in hours, not days. Automatic reminders included.',
                color: 'orange',
              },
              {
                icon: BarChart3,
                title: 'Dashboard Analytics',
                description: 'Track contract status, pending signatures, and completion rates at a glance.',
                color: 'pink',
              },
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-indigo-200 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}-100 flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Create, send, and sign contracts in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Choose a Template',
                description: 'Select from professional templates or create from scratch with AI assistance.',
              },
              {
                step: '2',
                title: 'Customize & Send',
                description: 'Fill in the details, add clauses with AI suggestions, and send for signature.',
              },
              {
                step: '3',
                title: 'Collect Signatures',
                description: 'Recipients sign online from any device. Get notified when completed.',
              },
            ].map((step, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 rounded-full bg-indigo-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Start free, upgrade when you need more.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  '3 contracts per month',
                  '5 templates',
                  '10 signatures per month',
                  'Basic audit trail',
                  'Email support',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-indigo-100 mb-6">For growing businesses</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-indigo-100">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited contracts',
                  'Unlimited templates',
                  'Unlimited signatures',
                  'Full audit trail with PDF export',
                  'AI clause suggestions',
                  'Custom branding',
                  'Priority support',
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-indigo-200" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login">
                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50">
                  Start Pro Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Streamline Your Contracts?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join thousands of freelancers and businesses who trust VibeContracts 
            for their contract needs.
          </p>
          <Link href="/login">
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">VibeContracts</span>
            </div>
            <div className="flex gap-8 text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </div>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} VibeContracts. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
