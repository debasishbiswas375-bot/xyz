import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle, Star, Zap, Shield, Headphones } from 'lucide-react'

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '',
      description: 'Perfect for getting started',
      features: [
        '10 free credits',
        'Basic file conversion',
        'AI ledger mapping',
        'Email support',
        'Free tool access'
      ],
      highlighted: false,
      buttonText: 'Get Started',
      buttonLink: '/register'
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'Best for growing businesses',
      features: [
        '500 credits per month',
        'Advanced file processing',
        'Priority AI learning',
        'Priority support',
        'Bulk operations',
        'Custom templates',
        'API access'
      ],
      highlighted: true,
      buttonText: 'Start Free Trial',
      buttonLink: '/register'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations',
      features: [
        'Unlimited credits',
        'Custom integrations',
        'Dedicated support',
        'White-label options',
        'Advanced analytics',
        'Custom AI training',
        'SLA guarantee'
      ],
      highlighted: false,
      buttonText: 'Contact Sales',
      buttonLink: '/register'
    }
  ]

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process hundreds of transactions in seconds with our optimized engine'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Bank-level security with 99.9% uptime guarantee'
    },
    {
      icon: Headphones,
      title: 'Expert Support',
      description: 'Get help when you need it from our dedicated support team'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your business. Start free and scale as you grow.
          </p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>14-day free trial on all paid plans</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>No credit card required</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`card relative ${
                  plan.highlighted ? 'border-2 border-primary-500 scale-105' : ''
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={plan.buttonLink}
                  className={`btn w-full ${
                    plan.highlighted ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Accountesy?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to save you time and money
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-2">How do credits work?</h3>
              <p className="text-gray-600">
                Each voucher conversion costs 0.1 credit. For example, converting 100 transactions 
                uses 10 credits. Credits are deducted only after successful XML generation.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Can I change my plan anytime?</h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect 
                at the next billing cycle, and we'll prorate any differences.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-2">What file formats do you support?</h3>
              <p className="text-gray-600">
                We support CSV, Excel (.xlsx), and PDF files. Our AI engine can extract 
                transactions from various formats and automatically normalize them.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Is my data secure?</h3>
              <p className="text-gray-600">
                Absolutely. We use bank-level encryption, secure servers, and follow 
                industry best practices to keep your financial data safe and private.
              </p>
            </div>

            <div className="card">
              <h3 className="text-lg font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">
                We offer a 14-day money-back guarantee for all paid plans. If you're 
                not satisfied, contact our support team for a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Accounting?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses saving hours on manual data entry every month.
          </p>
          <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-50 text-lg px-8 py-3">
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Pricing
