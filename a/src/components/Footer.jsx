import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Accountesy</span>
            </div>
            <p className="text-gray-300 mb-4">
              Smart accounting solution for modern businesses. Convert, analyze, and generate XML vouchers with AI-powered ledger mapping.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <Mail className="w-4 h-4" />
                <span>support@accountesy.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/free-tool" className="text-gray-300 hover:text-white transition-colors">
                  Free PDF to Excel Tool
                </Link>
              </li>
              <li>
                <Link to="/downloads" className="text-gray-300 hover:text-white transition-colors">
                  Download Center
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  GDPR Compliance
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a href="/convert" className="text-gray-600 hover:text-primary-600 transition-colors">
                      Convert Files
                    </a>
                  </li>
                  <li>
                    <a href="/free-converter" className="text-gray-600 hover:text-primary-600 transition-colors">
                      Free Tool
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors">
                      Contact
                    </a>
                  </li>
                  <li>
                    <a href="/careers" className="text-gray-600 hover:text-primary-600 transition-colors">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/downloads" className="text-gray-600 hover:text-primary-600 transition-colors">
                      Downloads
                    </a>
                  </li>
                  <li>
                    <a href="/documentation" className="text-gray-600 hover:text-primary-600 transition-colors">
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a href="/support" className="text-gray-600 hover:text-primary-600 transition-colors">
                      Support
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="/privacy" className="text-gray-600 hover:text-primary-600 transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="/terms" className="text-gray-600 hover:text-primary-600 transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="/cookies" className="text-gray-600 hover:text-primary-600 transition-colors">
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-200 mt-8 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="text-gray-600">
                  &copy; 2024 Accountesy. All rights reserved.
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <span>Sponsored by</span>
                  <img 
                    src="/static/assets/logo1.png" 
                    alt="Sponsor" 
                    className="w-5 h-5 transition-transform hover:scale-110 filter grayscale hover:grayscale-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
