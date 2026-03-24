import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addToast } = useToast()
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      addToast({ title: 'Fill all fields', variant: 'destructive' })
      return
    }

    setLoading(true)

    try {
      await login(email, password, rememberMe)
      
      addToast({ title: 'Login successful', variant: 'success' })
      navigate('/dashboard')

    } catch (err: any) {
      addToast({ title: err.message || 'Login failed', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Login</CardTitle>
            <CardDescription>Use your email</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              <Input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email"
                icon={<LogIn className="h-4 w-4" />}
              />

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="remember" className="text-sm">
                  Remember Me
                </label>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <p className="text-center text-sm">
                No account? <Link to="/register">Register</Link>
              </p>

            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
