import React, { useState, useEffect } from 'react'
import { Download, FileText, Search, Filter } from 'lucide-react'
import axios from 'axios'

const Downloads = () => {
  const [downloads, setDownloads] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchDownloads()
  }, [])

  const fetchDownloads = async () => {
    try {
      const response = await axios.get('/api/downloads/')
      setDownloads(response.data)
    } catch (error) {
      console.error('Failed to fetch downloads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await axios.get(`/api/downloads/download/${fileId}`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download file:', error)
    }
  }

  const categories = ['all', ...new Set(downloads.map(d => d.category))]
  
  const filteredDownloads = downloads.filter(download => {
    const matchesSearch = download.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         download.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || download.category === selectedCategory
    return matchesSearch && matchesCategory
  })

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
          <h1 className="text-3xl font-bold text-gray-900">Download Center</h1>
          <p className="text-gray-600 mt-2">
            Access sample files, templates, and tools to enhance your accounting workflow
          </p>
        </div>

        {/* Search and Filter */}
        <div className="card mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search downloads..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                className="input"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Downloads Grid */}
        {filteredDownloads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDownloads.map((download) => (
              <div key={download.id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {download.category}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{download.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{download.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(download.created_at).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDownload(download.id, download.name)}
                    className="btn btn-primary text-sm flex items-center"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No downloads found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No downloads are available at the moment.'
              }
            </p>
          </div>
        )}

        {/* Categories Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.filter(cat => cat !== 'all').map(category => {
              const count = downloads.filter(d => d.category === category).length
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`card text-left hover:shadow-md transition-shadow ${
                    selectedCategory === category ? 'border-2 border-primary-500' : ''
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 capitalize">{category}</h3>
                  <p className="text-sm text-gray-600">{count} files available</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Need Help with Downloads?
            </h3>
            <p className="text-gray-600 mb-6">
              Our support team is here to help you make the most of these resources.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/support" className="btn btn-secondary">
                View Documentation
              </a>
              <a href="mailto:support@accountesy.com" className="btn btn-primary">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Downloads
