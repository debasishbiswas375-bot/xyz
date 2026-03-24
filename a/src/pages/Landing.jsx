import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowRight, Upload, Brain, FileText, Shield, Zap, Users, CheckCircle } from 'lucide-react'

const Landing = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-100 py-20 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-96 h-96 bg-primary-200/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
              Smart Accounting for
              <span className="text-primary-600 relative">
                Modern Business
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-600/30 rounded-full"></span>
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-delay">
              Transform your financial documents with AI-powered precision
            </p>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-delay">
              Save hours of manual work with intelligent automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn btn-primary text-lg px-8 py-3 flex items-center justify-center">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/free-converter" className="btn btn-secondary text-lg px-8 py-3">
                Try Free Excel Converter
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Sponsor Badge */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="relative group">
          <div className="absolute inset-0 bg-black/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative bg-white rounded-lg shadow-lg border border-gray-200 p-2 flex items-center space-x-2 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
            <img 
              src="/static/assets/logo1.png" 
              alt="Sponsor" 
              className="w-6 h-6 transition-transform group-hover:rotate-12 filter grayscale group-hover:grayscale-0"
            />
            <span className="text-xs text-gray-600 font-medium">Partner</span>
          </div>
        </div>
      </div>

      {/* Sponsor Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mr-4">
                Trusted by Partners
              </h2>
            </div>
            
            <div className="relative inline-block group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-success-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm group-hover:blur-0"></div>
              <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                <img 
                  src="/static/assets/logo1.png" 
                  alt="Sponsor" 
                  className="w-16 h-16 mx-auto mb-4 transition-transform group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                />
                <p className="text-sm text-gray-600 font-medium">
                  Premium Technology Partner
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to streamline your accounting workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Upload className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Format Support</h3>
              <p className="text-gray-600">
                Upload CSV, Excel, or PDF files and we'll extract and normalize your data automatically.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Mapping</h3>
              <p className="text-gray-600">
                Smart ledger mapping with confidence scoring. Learns from your edits to improve accuracy.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">XML Generation</h3>
              <p className="text-gray-600">
                Generate standardized XML vouchers ready for accounting systems with one click.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Preview & Edit</h3>
              <p className="text-gray-600">
                Review all transactions before generation. Edit ledgers and filter by confidence level.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">
                Process hundreds of transactions in seconds. No more manual data entry.
              </p>
            </div>

            <div className="card text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Share results and maintain consistent ledger mapping across your organization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple 4-step process to convert your files
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Upload File</h3>
              <p className="text-gray-600">Upload your CSV, Excel, or PDF file</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Mapping</h3>
              <p className="text-gray-600">AI maps transactions to ledgers</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Review & Edit</h3>
              <p className="text-gray-600">Preview and edit if needed</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Generate XML</h3>
              <p className="text-gray-600">Download your XML file</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start with 10 free credits, then pay as you go
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card text-center">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <div className="text-3xl font-bold mb-4">$0</div>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  10 free credits
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Basic features
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Free tool access
                </li>
              </ul>
              <Link to="/register" className="btn btn-secondary w-full">
                Get Started
              </Link>
            </div>

            <div className="card text-center border-2 border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-sm">
                Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <div className="text-3xl font-bold mb-4">$29<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  500 credits/month
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Priority support
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Advanced features
                </li>
              </ul>
              <Link to="/register" className="btn btn-primary w-full">
                Upgrade Now
              </Link>
            </div>

            <div className="card text-center">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <div className="text-3xl font-bold mb-4">Custom</div>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Unlimited credits
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Custom integrations
                </li>
                <li className="flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Dedicated support
                </li>
              </ul>
              <Link to="/register" className="btn btn-secondary w-full">
                Contact Sales
              </Link>
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
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Landing
