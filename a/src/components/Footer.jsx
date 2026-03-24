import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300">

      {/* Feedback */}
      <div className="bg-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            We Value Your Feedback
          </h2>

          <p className="text-gray-400 mb-8">
            Help us improve Accountesy with your suggestions.
          </p>

          <FeedbackForm />
        </div>
      </div>

      {/* Footer Main */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <div className="bg-white p-2 rounded-lg mr-3">
                <img src="/static/assets/logo.png" className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Accountesy</h3>
            </div>

            <p className="text-gray-400 mb-4">
              Smart Accounting for Modern Business
            </p>

            <p className="text-gray-500 text-sm">
              Convert bank statements into Tally XML with AI-powered accuracy.
            </p>
          </div>

          {/* Created By */}
          <div>
            <h4 className="text-white font-semibold mb-4">Created By</h4>

            <p>Debasish Biswas</p>

            <div className="flex items-center text-gray-400 text-sm mt-2">
              <MapPin className="h-4 w-4 mr-2" />
              Baharampur, West Bengal
            </div>

            <div className="flex items-center text-gray-400 text-sm mt-2">
              <Mail className="h-4 w-4 mr-2" />
              debasish@example.com
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>

            <ul className="space-y-2">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/free-tool">Free Tool</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/downloads">Downloads</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Sign Up</Link></li>
            </ul>
          </div>

          {/* Sponsor */}
          <div>
            <h4 className="text-white font-semibold mb-4">Sponsor</h4>

            <div className="bg-gray-800 p-4 rounded-xl shadow-lg">
              <p className="text-gray-400 text-sm mb-2">Sponsored By</p>

              <div className="bg-white p-2 rounded-lg inline-block mb-3">
                <img src="/static/assets/logo1.png" className="h-10" />
              </div>

              <p className="text-white font-semibold">
                Uday Mondal | Tax Consultant Advocate
              </p>

              <p className="text-gray-400 text-sm">
                Baharampur, West Bengal
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 py-6 text-center text-sm text-gray-400">
        © {currentYear} Accountesy. All rights reserved.
      </div>
    </footer>
  )
}

const FeedbackForm = () => {
  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-xl">
        <button className="bg-primary-600 text-white px-6 py-3 rounded-lg">
          Submit Feedback
        </button>
      </div>
    </div>
  )
}

export default Footer
