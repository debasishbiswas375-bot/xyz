import React, { useState } from 'react'
import { Upload, FileText, Download, Zap, CheckCircle } from 'lucide-react'

const FreeTool = () => {
  const [file, setFile] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState('')

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0]
    if (!uploadedFile) return

    setFile(uploadedFile)
    setProcessing(true)
    setError('')

    // Simulate processing
    setTimeout(() => {
      setProcessing(false)
      setCompleted(true)
    }, 2000)
  }

  const handleDownload = () => {
    // Simulate download
    const csvContent = "Date,Description,Debit,Credit,Balance\n2024-01-01,Sample Transaction,100,,5000\n2024-01-02,Another Transaction,,200,5200"
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted_excel.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const resetTool = () => {
    setFile(null)
    setProcessing(false)
    setCompleted(false)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Free PDF to Excel Converter
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Convert your PDF bank statements to clean Excel format - No login required, No credits needed
          </p>
          
          <div className="flex justify-center items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span>No Registration</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span>No Credits Required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span>OCR Powered</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span>All Indian Banks</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Main Tool */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {!completed ? (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                Upload Your PDF Bank Statement
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-500 transition-colors">
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-medium text-gray-900 mb-2">
                  Drop your PDF file here or click to browse
                </p>
                <p className="text-gray-500 mb-6">
                  Supports PDF bank statements from all Indian banks, NBFCs, and Post Office
                </p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="free-file-upload"
                />
                <label
                  htmlFor="free-file-upload"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : 'Choose PDF File'}
                </label>
              </div>

              {file && !processing && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                    </div>
                    <button
                      onClick={resetTool}
                      className="text-sm text-red-600 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {processing && (
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                  </div>
                  <p className="mt-4 text-gray-600">Processing your PDF with OCR...</p>
                  <p className="text-sm text-gray-500">This may take a few moments</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Conversion Complete!
              </h2>
              <p className="text-gray-600 mb-6">
                Your PDF has been successfully converted to Excel format
              </p>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What's included:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Clean, formatted data</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Date, Description, Amount columns</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Ready for Excel analysis</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-gray-700">No watermarks</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Excel File
                </button>
                
                <div className="space-y-2">
                  <button
                    onClick={resetTool}
                    className="block w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Convert Another File
                  </button>
                  
                  <p className="text-sm text-gray-500">
                    Want more features?{' '}
                    <a href="/register" className="text-primary-600 hover:text-primary-500 font-medium">
                      Sign up for free
                    </a>{' '}
                    and get AI-powered Tally XML generation
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-8">Why Upgrade to Pro?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI Ledger Mapping
              </h3>
              <p className="text-gray-600 text-sm">
                Automatically categorize transactions with 75%+ accuracy
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tally XML Export
              </h3>
              <p className="text-gray-600 text-sm">
                Generate ready-to-import Tally XML files instantly
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Preview & Edit
              </h3>
              <p className="text-gray-600 text-sm">
                Full preview screen with editing capabilities
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <a
              href="/register"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
            >
              Start Free Trial
              <Zap className="h-5 w-5 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FreeTool
