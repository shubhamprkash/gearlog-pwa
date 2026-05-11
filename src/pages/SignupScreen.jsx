import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, Shield, Zap, ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function SignupScreen() {
  const navigate = useNavigate()
  const { signUp, signInWithGoogle } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      await signUp(email, password, email.split('@')[0])
      navigate('/home', { replace: true })
    } catch (err) {
      setError(err.message || 'Signup failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col px-6 py-8 relative">
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <button onClick={() => navigate('/')} className="w-10 h-10 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center mb-8">
        <ArrowLeft className="w-5 h-5 text-primary" />
      </button>

      <h1 className="text-3xl font-bold text-primary mb-1">Create Account</h1>
      <p className="text-sm text-muted mb-8">Join the fleet management system</p>

      <form onSubmit={handleSignup} className="space-y-4 flex-1">
        {error && (
          <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-caps text-muted">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-dark-input border border-dark-border rounded-xl pl-10 pr-4 py-3 text-primary text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-caps text-muted">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 6 characters"
              className="w-full bg-dark-input border border-dark-border rounded-xl pl-10 pr-10 py-3 text-primary text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
              required
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
              {showPass ? <EyeOff className="w-4 h-4 text-muted" /> : <Eye className="w-4 h-4 text-muted" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-caps text-muted">Confirm Password</label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full bg-dark-input border border-dark-border rounded-xl pl-10 pr-4 py-3 text-primary text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-accent/25 active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          <Zap className="w-4 h-4" />
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-dark-border" />
          <span className="text-xs text-muted">Or sync with</span>
          <div className="flex-1 h-px bg-dark-border" />
        </div>

        <button
          type="button"
          onClick={async () => {
            try { await signInWithGoogle() } catch (e) { setError(e.message) }
          }}
          className="w-full flex items-center justify-center gap-3 bg-dark-card border border-dark-border py-3.5 rounded-2xl font-semibold text-sm text-primary active:scale-[0.98] transition-transform"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-accent font-semibold">Login</Link>
      </p>
    </div>
  )
}
