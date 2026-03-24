import React, { useState, useEffect } from 'react'
import { Download, Calendar, FileText, CreditCard, Search } from 'lucide-react'
import axios from 'axios'

const History = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await axios.get('/api/history/')
      setHistory(response.data)
    } catch (error) {
      console.error('Failed to fetch history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (historyId) => {
    try {
      const response = await axios.get(`/api/history/download/${historyId}`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `accountesy_export_${historyId}.xml`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download file:', error)
    }
  }

  const filteredHistory = history.filter(item =>
    item.voucher_count.toString().includes(searchTerm) ||
    item.credits_used.toString().includes(searchTerm) ||
    new Date(item.timestamp).toLocaleDateString().includes(searchTerm)
  )

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Conversion History</h1>
          <p className="text-gray-600 mt-2">
            View and download your previous XML exports
          </p>
        </div>

        {/* Search */}
        <div className="card mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search history..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* History List */}
        {filteredHistory.length > 0 ? (
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <div key={item.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="p-3 bg-primary-100 rounded-lg">
                      <FileText className="w-6 h-6 text-primary-600" />
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.voucher_count} Vouchers
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(item.timestamp).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-1" />
                          {item.credits_used} credits
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDownload(item.id)}
                    className="btn btn-primary flex items-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download XML
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversion history</h3>
            <p className="text-gray-600 mb-6">
              You haven't converted any files yet. Start by uploading your first file.
            </p>
            <a href="/convert" className="btn btn-primary">
              Convert Your First File
            </a>
          </div>
        )}

        {/* Stats */}
        {history.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <p className="text-3xl font-bold text-gray-900">{history.length}</p>
              <p className="text-gray-600">Total Conversions</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-gray-900">
                {history.reduce((sum, item) => sum + item.voucher_count, 0)}
              </p>
              <p className="text-gray-600">Total Vouchers</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-gray-900">
                {history.reduce((sum, item) => sum + item.credits_used, 0).toFixed(1)}
              </p>
              <p className="text-gray-600">Credits Used</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default History
