import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import MainTool from './pages/MainTool'
import FreeTool from './pages/FreeTool'
import Pricing from './pages/Pricing'
import History from './pages/History'
import AdminPanel from './pages/AdminPanel'
import Downloads from './pages/Downloads'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/free-tool" element={<FreeTool />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/downloads" element={<Downloads />} />
            
            {/* Protected Routes */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" /> : <Register />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/main-tool" 
              element={user ? <MainTool /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/history" 
              element={user ? <History /> : <Navigate to="/login" />} 
            />
            
            {/* Admin Route */}
            <Route 
              path="/admin" 
              element={user && user.role === 'admin' ? <AdminPanel /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
