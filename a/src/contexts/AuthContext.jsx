import React, { createContext, useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Upload, FileText, Clock, TrendingUp, CreditCard, ArrowRight } from 'lucide-react'
import axios from 'axios'

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Configure axios defaults
    axios.defaults.baseURL = API_BASE_URL
    
    // Add axios interceptor for token
    axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    
    // Check both localStorage and sessionStorage for token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const userData = localStorage.getItem('user') || sessionStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/auth/me')
      setUser(response.data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      // Clear both storage types on error
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password, rememberMe = false) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password })
      const { access_token, user: userData } = response.data
      
      // Store token based on remember me preference
      if (rememberMe) {
        localStorage.setItem('token', access_token)
        localStorage.setItem('user', JSON.stringify(userData))
      } else {
        sessionStorage.setItem('token', access_token)
        sessionStorage.setItem('user', JSON.stringify(userData))
      }
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      setUser(userData)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      }
    }
  }

  const register = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/register', { email, password })
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
