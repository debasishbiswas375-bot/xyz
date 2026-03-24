import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Menu, X, User, LogOut, CreditCard } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">A</span>
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">Accountesy</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
          <a href="#workflow" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
          <Link to="/free-tool" className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">Free Tool</Link>
        </nav>

        {/* User Info & Menu */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* User Info */}
              <div className="hidden md:flex items-center gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="font-medium">{user.credits} credits</span>
                </div>
                <div className="text-muted-foreground">{user.email}</div>
              </div>
              
              {/* Hamburger Menu */}
              <div className="relative">
                <button 
                  className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <Menu className="h-6 w-6" />
                </button>
                
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-lg shadow-lg z-50 animate-fade-in">
                    <div className="py-2">
                      <Link 
                        to="/dashboard" 
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/convert" 
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Convert
                      </Link>
                      <Link 
                        to="/free-tool" 
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Free Tool
                      </Link>
                      <Link 
                        to="/pricing" 
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Pricing
                      </Link>
                      <Link 
                        to="/account" 
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Account
                      </Link>
                      <div className="border-t my-2"></div>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors text-red-600"
                        onClick={() => {
                          logout()
                          setDropdownOpen(false)
                          navigate('/')
                        }}
                      >
                        <LogOut className="inline h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/register">
                <Button variant="premium">Sign up free</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-6 py-4 space-y-4 animate-fade-in">
          {isAuthenticated && user && (
            <>
              <div className="flex items-center gap-2 text-sm border-b pb-4">
                <User className="h-4 w-4" />
                <span>{user.email}</span>
                <div className="flex items-center gap-1 ml-auto">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="font-medium">{user.credits}</span>
                </div>
              </div>
              <Link to="/dashboard" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <Link to="/convert" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Convert</Link>
              <Link to="/free-tool" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Free Tool</Link>
              <Link to="/pricing" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>Pricing</Link>
              <Link to="/account" className="block text-sm font-medium" onClick={() => setMobileOpen(false)}>My Account</Link>
              <button 
                className="block w-full text-left text-sm font-medium text-red-600"
                onClick={() => {
                  logout()
                  setMobileOpen(false)
                  navigate('/')
                }}
              >
                <LogOut className="inline h-4 w-4 mr-2" />
                Logout
              </button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <a href="#features" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Features</a>
              <a href="#workflow" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>How it Works</a>
              <a href="#pricing" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Pricing</a>
              <Link to="/free-tool" className="block text-sm font-medium text-accent" onClick={() => setMobileOpen(false)}>Free Tool</Link>
              <div className="flex gap-3 pt-2">
                <Link to="/login" className="flex-1"><Button variant="outline" className="w-full">Log in</Button></Link>
                <Link to="/register" className="flex-1"><Button variant="premium" className="w-full">Sign up</Button></Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  )
}
