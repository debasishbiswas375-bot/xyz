import React, { useState, useEffect } from 'react'
import { CheckCircle, Star, Zap, Crown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import axios from '../utils/api'

const Pricing = () => {
  const { user } = useAuth()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/plans/')
      setPlans(response.data || [])
    } catch (error) {
      console.error('Failed to fetch plans:', error)
      // Fallback to default plans
      setPlans([
        {
          id: '1',
          name: 'Free Plan',
          credits: 10,
          validity_months: 1,
          price: 0,
          is_active: true
        },
        {
          id: '2',
          name: 'Starter Plan',
          credits: 100,
          validity_months: 1,
          price: 299,
          is_active: true
        },
        {
          id: '3',
          name: 'Professional Plan',
          credits: 500,
          validity_months: 3,
          price: 999,
          is_active: true
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const features = [
    'PDF to Excel conversion',
    'OCR text extraction',
    'All Indian banks supported',
    'Basic transaction parsing',
    'Email support'
  ]

  const proFeatures = [
    ...features,
    'AI-powered ledger mapping',
    'Tally XML generation',
    'Confidence scoring',
    'Preview & edit transactions',
    'Bulk processing',
    'Priority support',
    'Custom ledger rules',
    'API access (Enterprise)'
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your business needs
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span>30-day guarantee</span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const isPopular = plan.name.toLowerCase().includes('professional')
            const isFree = plan.price === 0
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 ${
                  isPopular ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 text-xs font-semibold">
                    POPULAR
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="flex items-center justify-center">
                      {isFree ? (
                        <span className="text-4xl font-bold text-gray-900">Free</span>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
                          <span className="text-gray-500 ml-2">/{plan.validity_months > 1 ? `${plan.validity_months} months` : 'month'}</span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">
                      {plan.credits} credits included
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {(isFree ? features : proFeatures).map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center">
                    {isFree ? (
                      <button
                        className="w-full px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        disabled
                      >
                        Current Plan
                      </button>
                    ) : (
                      <a
                        href={user ? `/dashboard` : `/register`}
                        className="block w-full px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                      >
                        {user ? 'Upgrade Now' : 'Get Started'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Credit Usage Info */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">How Credits Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI Auto Mapping
              </h3>
              <p className="text-gray-600 mb-4">
                Let our AI automatically detect and map ledgers
              </p>
              <p className="text-2xl font-bold text-primary-600">0.1 credits</p>
              <p className="text-sm text-gray-500">per voucher</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Manual Selection
              </h3>
              <p className="text-gray-600 mb-4">
                Manually select ledger categories for full control
              </p>
              <p className="text-2xl font-bold text-primary-600">0.05 credits</p>
              <p className="text-sm text-gray-500">per voucher</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-center text-gray-600">
              <span className="font-semibold">Example:</span> 100 transactions with AI mapping = 10 credits
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do credits expire?
              </h3>
              <p className="text-gray-600">
                Yes, credits expire based on your plan validity. Free plan credits expire in 30 days, while paid plans have longer validity periods.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I change plans anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to additional credits.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What if I run out of credits?
              </h3>
              <p className="text-gray-600">
                You can purchase additional credits or upgrade to a higher plan at any time. Your credits will be added immediately.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! Every new user starts with 10 free credits to try out our AI-powered features.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee if you're not satisfied with our service.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, debit cards, UPI, and net banking for Indian customers.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-primary-600 rounded-lg p-8 text-white">
          <Crown className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-6 text-primary-100">
            Join thousands of businesses using Accountesy for smarter accounting
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center px-8 py-3 text-lg font-medium text-primary-600 bg-white rounded-lg hover:bg-gray-100"
            >
              Start Free Trial
              <Zap className="h-5 w-5 ml-2" />
            </a>
            <a
              href="/free-tool"
              className="inline-flex items-center px-8 py-3 text-lg font-medium text-white border-2 border-white rounded-lg hover:bg-white hover:text-primary-600"
            >
              Try Free Tool
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pricing
