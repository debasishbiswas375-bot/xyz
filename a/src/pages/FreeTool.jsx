import React, { useState } from 'react'
import { Upload, File, Download, AlertCircle, CheckCircle } from 'lucide-react'
import axios from 'axios'

const FreeTool = () => {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [converting, setConverting] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [error, setError] = useState('')

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Conversion failed. Please upload a valid PDF file.')
      return
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB')
      return
    }
    
    setFile(file)
    setError('')
    setDownloadUrl('')
  }

  const handleConvert = async () => {
    if (!file) return
    
    setConverting(true)
    setError('')
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await axios.post('/api/free/pdf-to-excel', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Create download URL
      const url = window.URL.createObjectURL(new Blob([response.data]))
      setDownloadUrl(url)
    } catch (error) {
      setError(error.response?.data?.detail || 'Conversion failed')
    } finally {
      setConverting(false)
    }
  }

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = file.name.replace('.pdf', '.xlsx')
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const resetForm = () => {
    setFile(null)
    setDownloadUrl('')
    setError('')
    if (downloadUrl) {
      window.URL.revokeObjectURL(downloadUrl)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Excel Converter (Free)
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Convert PDF files into Excel instantly. No login required. Fast, simple, and completely free.
          </p>
        </div>

        {/* Main Tool */}
        <div className="card">
          {!downloadUrl ? (
            <>
              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  dragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileInput}
                />
                
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-gray-500" />
                  </div>
                  
                  <div>
                    <label
                      htmlFor="file-upload"
                      className="btn btn-primary cursor-pointer"
                    >
                      Upload your PDF file
                    </label>
                    <p className="text-gray-500 mt-2">or drag and drop your PDF here</p>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Maximum file size: 10MB • Text-based PDFs work best
                  </p>
                </div>
              </div>

              {/* File Selected */}
              {file && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <File className="w-8 h-8 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={resetForm}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={resetForm}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConvert}
                      disabled={converting}
                      className="btn btn-primary"
                    >
                      {converting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Converting...
                        </>
                      ) : (
                        'Convert to Excel'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              )}
            </>
          ) : (
            /* Success Section */
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-success-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Conversion Complete!
              </h2>
              <p className="text-gray-600 mb-6">
                Your PDF has been successfully converted to Excel format.
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Convert Another File
                </button>
                <button
                  onClick={handleDownload}
                  className="btn btn-primary"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Excel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Steps */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-12">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3">1</div>
              <span className="text-lg">Upload PDF</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3">2</div>
              <span className="text-lg">Click Convert</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3">3</div>
              <span className="text-lg">Download Excel</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Upload</h3>
            <p className="text-gray-600">
              Simply drag and drop your PDF file or click to browse
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <File className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Extraction</h3>
            <p className="text-gray-600">
              Our AI extracts tables and data from your PDF accurately
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Download</h3>
            <p className="text-gray-600">
              Get your Excel file immediately after conversion
            </p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-12 card">
          <h3 className="text-lg font-semibold mb-4">Best Results Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">✅ What Works Best</h4>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Text-based PDFs (not scanned images)</li>
                <li>• Clear table structures</li>
                <li>• Consistent formatting</li>
                <li>• Standard fonts and layouts</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">⚠️ Limitations</h4>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Scanned image PDFs</li>
                <li>• Handwritten documents</li>
                <li>• Complex merged cells</li>
                <li>• Password-protected files</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="mt-12 card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Want More Features?
            </h3>
            <p className="text-gray-600 mb-6">
              Upgrade to Accountesy Pro for AI-powered ledger mapping, XML generation, 
              and advanced accounting features.
            </p>
            <a href="/pricing" className="btn btn-primary">
              Explore Pro Features
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FreeTool
