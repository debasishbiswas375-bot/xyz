import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, File, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import axios from 'axios'

const Convert = () => {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [error, setError] = useState('')
  
  const navigate = useNavigate()

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
    const allowedTypes = ['csv', 'xlsx', 'pdf']
    const fileExtension = file.name.split('.').pop().toLowerCase()
    
    if (!allowedTypes.includes(fileExtension)) {
      setError('Only CSV, Excel, and PDF files are supported')
      return
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB')
      return
    }
    
    setFile(file)
    setError('')
    setUploadResult(null)
  }

  const handleUpload = async () => {
    if (!file) return
    
    setUploading(true)
    setError('')
    
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await axios.post('/api/convert/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setUploadResult(response.data)
    } catch (error) {
      setError(error.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handlePreview = () => {
    if (uploadResult && uploadResult.transactions) {
      navigate('/preview', { state: { transactions: uploadResult.transactions } })
    }
  }

  const resetForm = () => {
    setFile(null)
    setUploadResult(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Convert Files</h1>
          <p className="text-gray-600 mt-2">
            Upload your CSV, Excel, or PDF file to convert transactions to XML vouchers
          </p>
        </div>

        {/* Upload Section */}
        {!uploadResult ? (
          <div className="card">
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
                accept=".csv,.xlsx,.pdf"
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
                    Choose File
                  </label>
                  <p className="text-gray-500 mt-2">or drag and drop your file here</p>
                </div>
                
                <p className="text-sm text-gray-500">
                  Supported formats: CSV, Excel (.xlsx), PDF (Max 10MB)
                </p>
              </div>
            </div>

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
                    onClick={handleUpload}
                    disabled={uploading}
                    className="btn btn-primary"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      'Upload & Convert'
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
          </div>
        ) : (
          /* Success Section */
          <div className="card">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-success-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                File Converted Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                We found {uploadResult.transactions.length} transactions in your file.
                AI has mapped them to appropriate ledgers with confidence scores.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {uploadResult.transactions.length}
                  </p>
                  <p className="text-gray-600">Transactions Found</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {uploadResult.transactions.filter(t => t.confidence >= 75).length}
                  </p>
                  <p className="text-gray-600">High Confidence</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-2xl font-bold text-gray-900">
                    {(uploadResult.transactions.length * 0.1).toFixed(1)}
                  </p>
                  <p className="text-gray-600">Credits Required</p>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Convert Another File
                </button>
                <button
                  onClick={handlePreview}
                  className="btn btn-primary"
                >
                  Review & Edit
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 card">
          <h3 className="text-lg font-semibold mb-4">File Format Guidelines</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">CSV/Excel Files</h4>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Include columns for: Date, Description/Narration, Amount</li>
                <li>• Date format: DD/MM/YYYY or YYYY-MM-DD</li>
                <li>• Amount should be numeric (positive values only)</li>
                <li>• First row should contain column headers</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">PDF Files</h4>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• PDF should contain tabular data</li>
                <li>• Tables should be properly formatted</li>
                <li>• Avoid scanned images (use text-based PDFs)</li>
                <li>• Maximum file size: 10MB</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Convert
