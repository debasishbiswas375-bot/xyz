import React, { useState, useEffect } from 'react'
import { Users, FileText, Brain, CreditCard, TrendingUp, Settings, Download, Search } from 'lucide-react'
import axios from 'axios'

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [aiMemory, setAiMemory] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes, memoryRes, logsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/users'),
        axios.get('/api/admin/ai-memory'),
        axios.get('/api/admin/logs')
      ])
      
      setStats(statsRes.data)
      setUsers(usersRes.data)
      setAiMemory(memoryRes.data)
      setLogs(logsRes.data)
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCredits = async (userId, credits) => {
    try {
      await axios.post(`/api/admin/users/${userId}/add-credits`, { credits })
      fetchAdminData()
    } catch (error) {
      console.error('Failed to add credits:', error)
    }
  }

  const handleDeleteMemory = async (memoryId) => {
    try {
      await axios.delete(`/api/admin/ai-memory/${memoryId}`)
      setAiMemory(aiMemory.filter(m => m.id !== memoryId))
    } catch (error) {
      console.error('Failed to delete memory:', error)
    }
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'ai-memory', label: 'AI Memory', icon: Brain },
    { id: 'logs', label: 'Logs', icon: FileText },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.users?.total || 0}</p>
                <p className="text-gray-600">Total Users</p>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-success-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.conversions?.total || 0}</p>
                <p className="text-gray-600">Conversions</p>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 h-6 text-warning-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.users?.total_credits || 0}</p>
                <p className="text-gray-600">Total Credits</p>
              </div>
              
              <div className="card text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.ai_memory?.total_entries || 0}</p>
                <p className="text-gray-600">AI Memory Entries</p>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {logs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{log.voucher_count} vouchers processed</p>
                      <p className="text-sm text-gray-600">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {log.credits_used} credits
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">User Management</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users
                    .filter(user => user.email.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{user.credits}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleAddCredits(user.id, 10)}
                          className="btn btn-primary text-sm mr-2"
                        >
                          Add 10 Credits
                        </button>
                        <button
                          onClick={() => handleAddCredits(user.id, 50)}
                          className="btn btn-secondary text-sm"
                        >
                          Add 50 Credits
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      
      case 'ai-memory':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">AI Memory Management</h3>
              <span className="text-sm text-gray-600">
                {aiMemory.length} total entries
              </span>
            </div>
            
            <div className="space-y-3">
              {aiMemory.map((memory) => (
                <div key={memory.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          "{memory.narration}"
                        </span>
                        <span className="text-sm text-gray-600">→</span>
                        <span className="text-sm font-medium text-primary-600">
                          {memory.ledger}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {memory.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        User: {memory.user_id} • {new Date(memory.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteMemory(memory.id)}
                      className="text-red-600 hover:text-red-800 ml-4"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case 'logs':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">System Logs</h3>
            <div className="space-y-3">
              {logs.map((log) => (
                <div key={log.id} className="card">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {log.voucher_count} vouchers generated
                      </p>
                      <p className="text-sm text-gray-600">
                        User: {log.user_id} • {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {log.credits_used} credits
                      </p>
                      <p className="text-xs text-gray-500">
                        {log.xml_path}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      default:
        return null
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">
            Manage users, credits, and system settings
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
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin
