import React from 'react'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Send } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Feedback Section */}
      <div className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">We Value Your Feedback</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Help us improve Accountesy by sharing your thoughts, suggestions, or reporting issues.
            </p>
            
            <FeedbackForm />
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-4">
                <img 
                  src="/static/assets/logo.png" 
                  alt="Accountesy" 
                  className="h-8 w-8 mr-3"
                />
                <h3 className="text-xl font-bold text-white">Accountesy</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-sm">
                Smart Accounting for Modern Business
              </p>
              <p className="text-gray-500 text-sm">
                Transform your bank statements into ready-to-import Tally XML files with AI-powered accuracy.
              </p>
            </div>

            {/* Created By Section */}
            <div>
              <h4 className="text-white font-semibold mb-4">Created By</h4>
              <div className="space-y-2">
                <p className="text-gray-300">Debasish Biswas</p>
                <div className="flex items-center text-gray-400 text-sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Baharampur, West Bengal, India</span>
                </div>
                <div className="flex items-center text-gray-400 text-sm">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>debasish@example.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/free-tool" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Free Tool
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/pricing" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/downloads" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Downloads
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sponsor Section */}
            <div>
              <h4 className="text-white font-semibold mb-4">Sponsor</h4>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-3">Sponsored By</p>
                <img 
                  src="/static/assets/logo1.png" 
                  alt="Sponsor" 
                  className="h-12 w-auto mb-2"
                />
                <p className="text-gray-300 text-sm font-medium">Tech Innovations Pvt Ltd</p>
                <p className="text-gray-500 text-xs">Kolkata, West Bengal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info & Copyright */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>support@accountesy.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © {currentYear} Accountesy. All rights reserved.
              </p>
              <div className="mt-2 space-x-4 text-xs">
                <a href="#" className="text-gray-500 hover:text-gray-300">Privacy Policy</a>
                <a href="#" className="text-gray-500 hover:text-gray-300">Terms of Service</a>
                <a href="#" className="text-gray-500 hover:text-gray-300">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

const FeedbackForm = () => {
  const [formData, setFormData] = React.useState({
    full_name: '',
    username: '',
    email: '',
    contact_number: '',
    message: ''
  })
  const [errors, setErrors] = React.useState({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitMessage, setSubmitMessage] = React.useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required'
    }
    
    if (formData.message.trim().length < 30) {
      newErrors.message = 'Message must be at least 30 characters long'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        const result = await response.json()
        setSubmitMessage('Thank you for your feedback! We appreciate your input.')
        setFormData({
          full_name: '',
          username: '',
          email: '',
          contact_number: '',
          message: ''
        })
        setErrors({})
      } else {
        const error = await response.json()
        setErrors({ submit: error.detail || 'Failed to submit feedback' })
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.full_name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Your username (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Share your feedback, suggestions, or report issues (minimum 30 characters)"
            />
            <div className="mt-1 text-sm text-gray-500">
              {formData.message.length}/30 characters minimum
            </div>
            {errors.message && (
              <p className="mt-1 text-sm text-red-600">{errors.message}</p>
            )}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {submitMessage && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
              {submitMessage}
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Footer
