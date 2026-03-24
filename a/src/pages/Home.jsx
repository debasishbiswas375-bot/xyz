import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Download, Zap, Shield, Star, CheckCircle } from 'lucide-react'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Smart Accounting for Modern Business
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Convert bank statements to Tally XML with AI-powered accuracy. 
              Supports all Indian banks, NBFCs, and Post Office.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-3 text-lg font-medium text-white bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/free-tool"
                className="inline-flex items-center px-8 py-3 text-lg font-medium text-white border-2 border-white rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Try Free Tool
                <Zap className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-8">Sponsored by</p>
            <div className="flex justify-center items-center">
              <img 
                src="/static/assets/logo1.png" 
                alt="Sponsor" 
                className="h-16 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Accountesy?
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features designed for Indian businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                AI-Powered Mapping
              </h3>
              <p className="text-gray-600">
                Intelligent ledger detection with confidence scoring. 
                Auto-categorize transactions with 75%+ accuracy.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                All Indian Banks Supported
              </h3>
              <p className="text-gray-600">
                Works with all major Indian banks, NBFCs, and Post Office 
                statements. PDF, Excel, CSV formats supported.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Download className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Instant Tally Export
              </h3>
              <p className="text-gray-600">
                Generate ready-to-import Tally XML files instantly. 
                No manual data entry required.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <Star className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Free OCR Tool
              </h3>
              <p className="text-gray-600">
                Convert PDF bank statements to Excel for free. 
                No registration required, no credits needed.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Credit-Based Pricing
              </h3>
              <p className="text-gray-600">
                Pay only for what you use. AI mapping at 0.1 credits, 
                manual selection at 0.05 credits per voucher.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                <ArrowRight className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Preview & Edit
              </h3>
              <p className="text-gray-600">
                Full preview screen with single and bulk editing capabilities. 
                Change ledger assignments before final export.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Convert your bank statements in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Upload Your File
              </h3>
              <p className="text-gray-600">
                Upload PDF, Excel, or CSV bank statement from any Indian bank
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                AI Mapping or Manual Selection
              </h3>
              <p className="text-gray-600">
                Choose AI auto-mapping or manual ledger selection with confidence scoring
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Download Tally XML
              </h3>
              <p className="text-gray-600">
                Preview, edit if needed, and download ready-to-import Tally XML
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Ready to Transform Your Accounting?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of businesses using Accountesy for smarter accounting
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3 text-lg font-medium text-primary-600 bg-white rounded-lg hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/free-tool"
              className="inline-flex items-center px-8 py-3 text-lg font-medium text-white border-2 border-white rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              Try Free Converter
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
