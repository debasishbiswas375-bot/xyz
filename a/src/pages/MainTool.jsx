import React, { useState } from 'react'
import { Upload, FileText, Brain, Zap, Download, Edit, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import axios from '../utils/api'

const MainTool = () => {
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [file, setFile] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [processing, setProcessing] = useState(false)
  const [processingType, setProcessingType] = useState('')
  const [ledgerMapping, setLedgerMapping] = useState({})
  const [selectedLedger, setSelectedLedger] = useState('')
  const [editedTransactions, setEditedTransactions] = useState([])
  const [error, setError] = useState('')

  // Sample ledgers for dropdown
  const availableLedgers = [
    'SALARY', 'RENT', 'FOOD', 'TRANSPORT', 'UTILITIES', 
    'SHOPPING', 'BANK_CHARGES', 'CASH_WITHDRAWAL', 'TRANSFER', 'INSURANCE',
    'UNCATEGORIZED'
  ]

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0]
    if (!uploadedFile) return

    setFile(uploadedFile)
    setProcessing(true)
    setError('')

    const formData = new FormData()
    formData.append('file', uploadedFile)

    try {
      const response = await axios.post('/api/upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setTransactions(response.data.transactions)
      setEditedTransactions(response.data.transactions)
      setStep(2)
    } catch (error) {
      setError(error.response?.data?.detail || 'File upload failed')
    } finally {
      setProcessing(false)
    }
  }

  const handleProcess = async (useAi) => {
    setProcessing(true)
    setProcessingType(useAi ? 'ai' : 'manual')
    setError('')

    try {
      const response = await axios.post('/api/upload/process', {
        use_ai: useAi,
        selected_ledger: useAi ? null : selectedLedger
      })

      setLedgerMapping(response.data.ledger_mapping)
      setStep(3)
    } catch (error) {
      setError(error.response?.data?.detail || 'Processing failed')
    } finally {
      setProcessing(false)
    }
  }

  const handleTransactionEdit = (index, field, value) => {
    const updated = [...editedTransactions]
    updated[index] = { ...updated[index], [field]: value }
    setEditedTransactions(updated)
  }

  const handleLedgerChange = (index, newLedger) => {
    const updatedMapping = { ...ledgerMapping }
    updatedMapping[`transaction_${index}`] = {
      ...updatedMapping[`transaction_${index}`],
      ledger: newLedger,
      confidence: 1.0 // Manual selection has 100% confidence
    }
    setLedgerMapping(updatedMapping)
  }

  const getConfidenceColor = (confidence) => {
    if (confidence > 0.75) return 'text-green-600'
    if (confidence > 0.60) return 'text-orange-600'
    return 'text-red-600'
  }

  const getConfidenceIcon = (confidence) => {
    if (confidence > 0.75) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (confidence > 0.60) return <AlertCircle className="h-4 w-4 text-orange-600" />
    return <AlertCircle className="h-4 w-4 text-red-600" />
  }

  const handleGenerateXML = async () => {
    setProcessing(true)
    setError('')

    try {
      const response = await axios.post('/api/upload/generate-xml', {
        transactions: editedTransactions,
        ledger_mapping: ledgerMapping
      })

      // Create download link
      const blob = new Blob([response.data], { type: 'application/xml' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'tally_export.xml'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      setStep(4)
    } catch (error) {
      setError(error.response?.data?.detail || 'XML generation failed')
    } finally {
      setProcessing(false)
    }
  }

  const resetTool = () => {
    setStep(1)
    setFile(null)
    setTransactions([])
    setEditedTransactions([])
    setLedgerMapping({})
    setSelectedLedger('')
    setError('')
  }

  if (!user) {
    return <div>Please login to use this tool.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bank Statement Converter</h1>
          <p className="text-gray-600 mt-2">Convert your bank statements to Tally XML with AI-powered accuracy</p>
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-sm text-gray-600">Available credits:</span>
            <span className="text-lg font-semibold text-primary-600">{user.credits}</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Step 1: File Upload */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-semibold mb-6">Step 1: Upload Bank Statement</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Drop your bank statement here or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports PDF, Excel, and CSV files from all Indian banks
              </p>
              <input
                type="file"
                accept=".pdf,.csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 cursor-pointer"
              >
                {processing ? 'Processing...' : 'Choose File'}
              </label>
            </div>

            {file && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Processing Options */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-xl font-semibold mb-6">Step 2: Choose Processing Option</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Brain className="h-8 w-8 text-primary-600 mr-3" />
                  <h3 className="text-lg font-semibold">AI Auto Mapping</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Let our AI automatically detect and map ledgers with confidence scoring
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>• Cost: 0.1 credits per voucher</p>
                  <p>• Average accuracy: 75%+</p>
                  <p>• Confidence scoring included</p>
                </div>
                <button
                  onClick={() => handleProcess(true)}
                  disabled={processing || user.credits < (transactions.length * 0.1)}
                  className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : 'Use AI Mapping'}
                </button>
              </div>

              <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <Edit className="h-8 w-8 text-primary-600 mr-3" />
                  <h3 className="text-lg font-semibold">Manual Selection</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Manually select ledger categories for full control
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>• Cost: 0.05 credits per voucher</p>
                  <p>• 100% accuracy guaranteed</p>
                  <p>• Full control over mapping</p>
                </div>
                <div className="mt-4">
                  <select
                    value={selectedLedger}
                    onChange={(e) => setSelectedLedger(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 mb-2"
                  >
                    <option value="">Select default ledger</option>
                    {availableLedgers.map(ledger => (
                      <option key={ledger} value={ledger}>{ledger}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleProcess(false)}
                    disabled={processing || user.credits < (transactions.length * 0.05) || !selectedLedger}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing...' : 'Use Manual Selection'}
                  </button>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Total transactions: {transactions.length} | 
                Estimated cost: {transactions.length * 0.1} (AI) / {transactions.length * 0.05} (Manual) credits
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Preview and Edit */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Step 3: Preview and Edit Transactions</h2>
              <p className="text-sm text-gray-600 mt-1">
                Review and edit transactions before generating final XML
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Debit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ledger
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confidence
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {editedTransactions.map((transaction, index) => {
                    const mapping = ledgerMapping[`transaction_${index}`]
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={transaction.date}
                            onChange={(e) => handleTransactionEdit(index, 'date', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={transaction.description}
                            onChange={(e) => handleTransactionEdit(index, 'description', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={transaction.debit || ''}
                            onChange={(e) => handleTransactionEdit(index, 'debit', parseFloat(e.target.value) || null)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            value={transaction.credit || ''}
                            onChange={(e) => handleTransactionEdit(index, 'credit', parseFloat(e.target.value) || null)}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={mapping?.ledger || 'UNCATEGORIZED'}
                            onChange={(e) => handleLedgerChange(index, e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            {availableLedgers.map(ledger => (
                              <option key={ledger} value={ledger}>{ledger}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getConfidenceIcon(mapping?.confidence || 0)}
                            <span className={`ml-2 text-sm font-medium ${getConfidenceColor(mapping?.confidence || 0)}`}>
                              {Math.round((mapping?.confidence || 0) * 100)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <button
                  onClick={resetTool}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Start Over
                </button>
                <button
                  onClick={handleGenerateXML}
                  disabled={processing}
                  className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Generating...' : 'Generate Tally XML'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Conversion Complete!</h2>
            <p className="text-gray-600 mb-6">
              Your Tally XML file has been generated and downloaded successfully.
            </p>
            <div className="space-y-4">
              <button
                onClick={resetTool}
                className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                Convert Another File
              </button>
              <div>
                <Link
                  to="/history"
                  className="text-primary-600 hover:text-primary-500 text-sm"
                >
                  View Conversion History
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MainTool
