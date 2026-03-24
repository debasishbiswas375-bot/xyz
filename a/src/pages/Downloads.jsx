import React from 'react'
import { Download, FileText, Windows, Apple, Linux, CheckCircle } from 'lucide-react'

const Downloads = () => {
  const downloads = [
    {
      name: 'Accountesy Desktop App',
      description: 'Native desktop application for Windows, Mac, and Linux',
      platforms: [
        { name: 'Windows', icon: Windows, url: '#', size: '45 MB' },
        { name: 'macOS', icon: Apple, url: '#', size: '52 MB' },
        { name: 'Linux', icon: Linux, url: '#', size: '38 MB' }
      ],
      features: [
        'Offline processing',
        'Batch file conversion',
        'Advanced AI mapping',
        'Local data storage',
        'Priority updates'
      ]
    },
    {
      name: 'Mobile App',
      description: 'Convert bank statements on the go',
      platforms: [
        { name: 'Android', icon: Download, url: '#', size: '28 MB' },
        { name: 'iOS', icon: Download, url: '#', size: '32 MB' }
      ],
      features: [
        'Camera OCR scanning',
        'Quick conversion',
        'Cloud sync',
        'Push notifications',
        'Mobile-optimized UI'
      ]
    },
    {
      name: 'Browser Extension',
      description: 'Integrate with your browser for seamless workflow',
      platforms: [
        { name: 'Chrome', icon: Download, url: '#', size: '2.1 MB' },
        { name: 'Firefox', icon: Download, url: '#', size: '1.8 MB' },
        { name: 'Edge', icon: Download, url: '#', size: '2.3 MB' }
      ],
      features: [
        'One-click conversion',
        'Auto-detect bank statements',
        'Quick preview',
        'Direct download',
        'No redirects'
      ]
    },
    {
      name: 'API Documentation',
      description: 'Integrate Accountesy into your applications',
      platforms: [
        { name: 'Documentation', icon: FileText, url: '#', size: 'Online' },
        { name: 'SDK', icon: Download, url: '#', size: '15 MB' },
        { name: 'Postman Collection', icon: Download, url: '#', size: '128 KB' }
      ],
      features: [
        'RESTful API',
        'Webhook support',
        'Comprehensive docs',
        'Code examples',
        'Sandbox environment'
      ]
    }
  ]

  const systemRequirements = {
    desktop: {
      title: 'Desktop App Requirements',
      requirements: [
        'Windows 10/11, macOS 10.14+, or Ubuntu 20.04+',
        '4GB RAM minimum (8GB recommended)',
        '500MB available disk space',
        'Active internet connection for AI features',
        'Microsoft .NET Framework 4.8 (Windows only)'
      ]
    },
    mobile: {
      title: 'Mobile App Requirements',
      requirements: [
        'iOS 13.0+ or Android 8.0+',
        '2GB RAM minimum',
        '200MB available storage',
        'Camera access for OCR scanning',
        'iOS: iPhone 6s or newer, Android: ARMv7 or ARM64'
      ]
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Downloads & Resources
          </h1>
          <p className="text-xl text-gray-600">
            Get Accountesy on all your devices and platforms
          </p>
        </div>

        {/* Download Cards */}
        <div className="space-y-8 mb-16">
          {downloads.map((download, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {download.name}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {download.description}
                    </p>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {download.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-80">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Platforms</h3>
                    <div className="space-y-3">
                      {download.platforms.map((platform, idx) => {
                        const Icon = platform.icon
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center">
                              <Icon className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{platform.name}</p>
                                <p className="text-xs text-gray-500">{platform.size}</p>
                              </div>
                            </div>
                            <button className="px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {Object.entries(systemRequirements).map(([key, req]) => (
            <div key={key} className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {req.title}
              </h3>
              <ul className="space-y-2">
                {req.requirements.map((requirement, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Installation Guide */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Installation Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Download</h3>
              <p className="text-gray-600 text-sm">
                Choose your platform and download the appropriate installer
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Install</h3>
              <p className="text-gray-600 text-sm">
                Run the installer and follow the on-screen instructions
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Login & Start</h3>
              <p className="text-gray-600 text-sm">
                Sign in with your Accountesy account and start converting
              </p>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you with installation and any questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/support"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-primary-600 bg-white rounded-md hover:bg-gray-50"
            >
              <FileText className="h-5 w-5 mr-2" />
              Documentation
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Downloads
