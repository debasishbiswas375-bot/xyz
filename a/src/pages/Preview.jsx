import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Edit2, Check, X, Filter, Download, ArrowLeft } from 'lucide-react'
import axios from 'axios'

const Preview = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [transactions, setTransactions] = useState(location.state?.transactions || [])
  const [filter, setFilter] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [selectedTransactions, setSelectedTransactions] = useState([])
  const [bulkLedger, setBulkLedger] = useState('')
  const [generating, setGenerating] = useState(false)
  const [creditCheck, setCreditCheck] = useState(null)

  useEffect(() => {
    if (transactions.length === 0) {
      navigate('/convert')
    }
  }, [transactions, navigate])

  const getConfidenceColor = (confidence) => {
    if (confidence >= 75) return 'text-green-600 bg-green-50'
    if (confidence >= 60) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-50'
      case 'review': return 'text-orange-600 bg-orange-50'
      default: return 'text-red-600 bg-red-50'
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true
    if (filter === 'green') return transaction.confidence >= 75
    if (filter === 'orange') return transaction.confidence >= 60 && transaction.confidence < 75
    if (filter === 'red') return transaction.confidence < 60
    return true
  })

  const handleEdit = (transaction) => {
    setEditingId(transaction.id)
    setEditValue(transaction.ledger)
  }

  const handleSaveEdit = async (transaction) => {
    try {
      const response = await axios.post('/api/preview/edit', {
        transaction_id: transaction.id,
        new_ledger: editValue,
        transactions: transactions
      })
      
      if (response.data.success) {
        const updatedTransactions = transactions.map(t =>
          t.id === transaction.id
            ? { ...t, ledger: editValue, confidence: 95, status: 'confirmed' }
            : t
        )
        setTransactions(updatedTransactions)
        setEditingId(null)
        setEditValue('')
      }
    } catch (error) {
      console.error('Failed to update transaction:', error)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditValue('')
  }

  const handleSelectTransaction = (transactionId) => {
    setSelectedTransactions(prev =>
      prev.includes(transactionId)
        ? prev.filter(id => id !== transactionId)
        : [...prev, transactionId]
    )
  }

  const handleSelectAll = () => {
    if (selectedTransactions.length === filteredTransactions.length) {
      setSelectedTransactions([])
    } else {
      setSelectedTransactions(filteredTransactions.map(t => t.id))
    }
  }

  const handleBulkUpdate = async () => {
    if (!bulkLedger || selectedTransactions.length === 0) return
    
    try {
      const response = await axios.post('/api/preview/bulk-update', {
        transaction_ids: selectedTransactions,
        new_ledger: bulkLedger,
        transactions: transactions
      })
      
      if (response.data.success) {
        const updatedTransactions = transactions.map(t =>
          selectedTransactions.includes(t.id)
            ? { ...t, ledger: bulkLedger, confidence: 95, status: 'confirmed' }
            : t
        )
        setTransactions(updatedTransactions)
        setSelectedTransactions([])
        setBulkLedger('')
      }
    } catch (error) {
      console.error('Failed to bulk update:', error)
    }
  }

  const checkCredits = async () => {
    try {
      const response = await axios.post('/api/credit/check', {
        user_id: 'current_user', // This would come from auth context
        voucher_count: transactions.length
      })
      setCreditCheck(response.data)
    } catch (error) {
      console.error('Failed to check credits:', error)
    }
  }

  const generateXML = async () => {
    setGenerating(true)
    
    try {
      const response = await axios.post('/api/history/generate-xml', transactions)
      
      if (response.data.success) {
        // Create download link for XML
        const blob = new Blob([response.data.xml_content], { type: 'application/xml' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `accountesy_export_${Date.now()}.xml`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
        
        navigate('/history')
      }
    } catch (error) {
      console.error('Failed to generate XML:', error)
    } finally {
      setGenerating(false)
    }
  }

  useEffect(() => {
    if (transactions.length > 0) {
      checkCredits()
    }
  }, [transactions])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/convert')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Review Transactions</h1>
              <p className="text-gray-600 mt-1">
                {filteredTransactions.length} transactions • AI-mapped ledgers
              </p>
            </div>
          </div>
          
          <button
            onClick={generateXML}
            disabled={generating || !creditCheck?.can_generate}
            className="btn btn-primary"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate XML
              </>
            )}
          </button>
        </div>

        {/* Credit Check Warning */}
        {creditCheck && !creditCheck.can_generate && (
          <div className="mb-6 bg-warning-50 border border-warning-200 text-warning-800 px-4 py-3 rounded-lg">
            Insufficient credits. Required: {creditCheck.required_credits}, Available: {creditCheck.available_credits}
          </div>
        )}

        {/* Filters and Bulk Actions */}
        <div className="card mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <div className="flex space-x-2">
                {['all', 'green', 'orange', 'red'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === filterType
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filterType === 'all' ? 'All' : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {selectedTransactions.length > 0 && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">
                  {selectedTransactions.length} selected
                </span>
                <input
                  type="text"
                  placeholder="New ledger name"
                  className="input text-sm"
                  value={bulkLedger}
                  onChange={(e) => setBulkLedger(e.target.value)}
                />
                <button
                  onClick={handleBulkUpdate}
                  className="btn btn-primary text-sm"
                >
                  Update Selected
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedTransactions.length === filteredTransactions.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Narration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ledger
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedTransactions.includes(transaction.id)}
                        onChange={() => handleSelectTransaction(transaction.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={transaction.narration}>
                        {transaction.narration}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === transaction.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            className="input text-sm"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(transaction)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-900">{transaction.ledger}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConfidenceColor(transaction.confidence)}`}>
                        {transaction.confidence}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-primary-600 hover:text-primary-800"
                        disabled={editingId === transaction.id}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card text-center">
            <p className="text-2xl font-bold text-green-600">
              {transactions.filter(t => t.confidence >= 75).length}
            </p>
            <p className="text-gray-600">High Confidence</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-orange-600">
              {transactions.filter(t => t.confidence >= 60 && t.confidence < 75).length}
            </p>
            <p className="text-gray-600">Medium Confidence</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-red-600">
              {transactions.filter(t => t.confidence < 60).length}
            </p>
            <p className="text-gray-600">Low Confidence</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preview
