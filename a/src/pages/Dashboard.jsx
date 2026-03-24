import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Upload, FileText, Clock, TrendingUp, CreditCard, ArrowRight } from 'lucide-react'
import axios from 'axios'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalConversions: 0,
    totalVouchers: 0,
    creditsUsed: 0,
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/history/')
      const history = response.data
      
      setStats({
        totalConversions: history.length,
        totalVouchers: history.reduce((sum, item) => sum + item.voucher_count, 0),
        creditsUsed: history.reduce((sum, item) => sum + item.credits_used, 0),
        recentActivity: history.slice(0, 5)
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your account today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Conversions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalConversions}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vouchers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVouchers}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-warning-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Credits Used</p>
                <p className="text-2xl font-bold text-gray-900">{stats.creditsUsed}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Available Credits</p>
                <p className="text-2xl font-bold text-gray-900">{user?.credits || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/convert"
                className="flex items-center justify-between p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <div className="flex items-center">
                  <Upload className="w-5 h-5 text-primary-600 mr-3" />
                  <span className="font-medium">Convert New File</span>
                </div>
                <ArrowRight className="w-5 h-5 text-primary-600" />
              </Link>
              
              <Link
                to="/history"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="font-medium">View History</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </Link>
              
              <Link
                to="/account"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="font-medium">Manage Credits</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600" />
              </Link>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            {stats.recentActivity.length > 0 ? (
              <div className="space-y-3">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {activity.voucher_count} vouchers
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {activity.credits_used} credits
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recent activity</p>
                <p className="text-sm mt-1">Start by converting your first file</p>
              </div>
            )}
          </div>
        </div>

        {/* Getting Started */}
        {stats.totalConversions === 0 && (
          <div className="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Getting Started with Accountesy
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Upload Your File</h3>
                  <p className="text-gray-600 text-sm">
                    Upload CSV, Excel, or PDF files with your transaction data
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Review & Edit</h3>
                  <p className="text-gray-600 text-sm">
                    AI maps transactions to ledgers. Review and edit as needed
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white text-xl font-bold">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">Generate XML</h3>
                  <p className="text-gray-600 text-sm">
                    Export standardized XML vouchers for your accounting system
                  </p>
                </div>
              </div>
              <Link to="/convert" className="btn btn-primary">
                Start Your First Conversion
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
