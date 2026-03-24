import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { User, CreditCard, Mail, Calendar, Shield } from 'lucide-react'

const Account = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'credits', label: 'Credits', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Email notifications</span>
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-gray-700">Auto-save drafts</span>
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                </label>
              </div>
            </div>
          </div>
        )
      
      case 'credits':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Credit Balance</h3>
              <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary-600 font-medium">Available Credits</p>
                    <p className="text-3xl font-bold text-primary-900">{user?.credits || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-primary-600 font-medium">Rate</p>
                    <p className="text-lg font-semibold text-primary-900">0.1 per voucher</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Purchase Credits</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card text-center hover:shadow-md transition-shadow cursor-pointer">
                  <p className="text-2xl font-bold text-gray-900 mb-2">100</p>
                  <p className="text-gray-600 mb-4">Credits</p>
                  <p className="text-xl font-bold text-primary-600 mb-4">$10</p>
                  <button className="btn btn-primary w-full">Purchase</button>
                </div>
                <div className="card text-center border-2 border-primary-500 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary-600 text-white px-3 py-1 rounded-full text-xs">
                    Best Value
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">500</p>
                  <p className="text-gray-600 mb-4">Credits</p>
                  <p className="text-xl font-bold text-primary-600 mb-4">$40</p>
                  <button className="btn btn-primary w-full">Purchase</button>
                </div>
                <div className="card text-center hover:shadow-md transition-shadow cursor-pointer">
                  <p className="text-2xl font-bold text-gray-900 mb-2">1000</p>
                  <p className="text-gray-600 mb-4">Credits</p>
                  <p className="text-xl font-bold text-primary-600 mb-4">$70</p>
                  <button className="btn btn-primary w-full">Purchase</button>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Credit Usage</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">This Month</span>
                  <span className="font-medium">12.5 credits</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Last Month</span>
                  <span className="font-medium">8.3 credits</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">All Time</span>
                  <span className="font-medium">45.8 credits</span>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="label">Current Password</label>
                  <input type="password" className="input" />
                </div>
                <div>
                  <label className="label">New Password</label>
                  <input type="password" className="input" />
                </div>
                <div>
                  <label className="label">Confirm New Password</label>
                  <input type="password" className="input" />
                </div>
                <button className="btn btn-primary">Update Password</button>
              </div>
            </div>
            
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
              <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-warning-800">2FA is not enabled</p>
                    <p className="text-sm text-warning-700">Add an extra layer of security to your account</p>
                  </div>
                  <button className="btn btn-primary">Enable 2FA</button>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-gray-600">Chrome on Windows • Active now</p>
                  </div>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Current</span>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="card">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account
