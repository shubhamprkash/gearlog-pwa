import React, { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { Mail, Lock, LogIn, ArrowLeft, Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react'

function validateEmail(v) {
  if (!v) return null
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!re.test(v)) return 'Enter a valid email address'
  return ''
}

export default function Login() {
  const nav = useNavigate()
  const { signIn, signInGoogle, loginDemo } = useStore()

  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({ email: false, pw: false })
  const touch = (field) => setTouched(p => ({ ...p, [field]: true }))

  const emailErr = useMemo(() => touched.email ? validateEmail(email) : null, [email, touched.email])
  const pwErr = useMemo(() => {
    if (!touched.pw || !pw) return null
    if (pw.length < 6) return 'Password must be at least 6 characters'
    return ''
  }, [pw, touched.pw])

  const canSubmit = email && emailErr === '' && pw.length >= 6 && !loading

  const submit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, pw: true })
    setErr('')

    const finalEmailErr = validateEmail(email)
    if (finalEmailErr) { setErr(finalEmailErr); return }
    if (pw.length < 6) { setErr('Password must be at least 6 characters'); return }

    setLoading(true)
    try {
      await signIn(email, pw)
      nav('/dashboard', { replace: true })
    } catch (e) {
      // Friendly error messages
      const msg = e.message || ''
      if (msg.includes('Invalid login')) setErr('Incorrect email or password')
      else if (msg.includes('Email not confirmed')) setErr('Please verify your email first')
      else setErr(msg || 'Login failed. Please try again.')
    }
    setLoading(false)
  }

  const handleDemo = () => {
    loginDemo()
    nav('/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col px-6 py-8">
      <button onClick={() => nav('/')} className="w-9 h-9 rounded-xl bg-[#1e293b] border border-[#334155] flex items-center justify-center mb-8">
        <ArrowLeft className="w-4 h-4 text-[#f1f5f9]" />
      </button>

      <h1 className="text-2xl font-bold text-[#f1f5f9] mb-1">Welcome Back</h1>
      <p className="text-sm text-[#64748b] mb-8">Sign in to your garage</p>

      <form onSubmit={submit} className="space-y-5 flex-1">
        {/* Server error */}
        {err && (
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl px-4 py-3 text-sm text-[#ef4444] flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{err}</span>
          </div>
        )}

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-caps text-[#64748b]">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onBlur={() => touch('email')}
              placeholder="your@email.com"
              required
              className={`w-full bg-[#1e293b] border rounded-xl pl-10 pr-10 py-3 text-[#f1f5f9] text-sm placeholder:text-[#64748b]/40 focus:outline-none transition ${
                emailErr === '' ? 'border-[#22c55e]/50 focus:border-[#22c55e]/70' :
                emailErr ? 'border-[#ef4444]/50 focus:border-[#ef4444]/70' :
                'border-[#334155] focus:border-[#f97316]/50'
              }`}
            />
            {touched.email && email && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {emailErr === '' ? <Check className="w-4 h-4 text-[#22c55e]" /> : <X className="w-4 h-4 text-[#ef4444]" />}
              </div>
            )}
          </div>
          {emailErr && <p className="text-[11px] text-[#ef4444] flex items-center gap-1"><X className="w-3 h-3" />{emailErr}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-caps text-[#64748b]">Password</label>
            <button type="button" className="text-[10px] text-[#f97316] font-medium">Forgot?</button>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <input
              type={showPw ? 'text' : 'password'}
              value={pw}
              onChange={e => setPw(e.target.value)}
              onBlur={() => touch('pw')}
              placeholder="Enter your password"
              required
              className={`w-full bg-[#1e293b] border rounded-xl pl-10 pr-10 py-3 text-[#f1f5f9] text-sm placeholder:text-[#64748b]/40 focus:outline-none transition ${
                pwErr === '' ? 'border-[#22c55e]/50' :
                pwErr ? 'border-[#ef4444]/50' :
                'border-[#334155] focus:border-[#f97316]/50'
              }`}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
              {showPw ? <EyeOff className="w-4 h-4 text-[#64748b]" /> : <Eye className="w-4 h-4 text-[#64748b]" />}
            </button>
          </div>
          {pwErr && <p className="text-[11px] text-[#ef4444] flex items-center gap-1"><X className="w-3 h-3" />{pwErr}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 bg-[#f97316] text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-[#f97316]/25 active:scale-[0.97] transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <LogIn className="w-4 h-4" />
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#334155]" />
          <span className="text-[10px] text-[#64748b]">or</span>
          <div className="flex-1 h-px bg-[#334155]" />
        </div>

        <button
          type="button"
          onClick={() => signInGoogle().catch(e => setErr(e.message))}
          className="w-full bg-[#1e293b] border border-[#334155] py-3.5 rounded-2xl text-sm font-semibold text-[#f1f5f9] active:scale-[0.97] transition"
        >
          Google Sign In
        </button>

        <button
          type="button"
          onClick={handleDemo}
          className="w-full bg-[#f97316]/10 border border-[#f97316]/20 py-3.5 rounded-2xl text-sm font-semibold text-[#f97316] active:scale-[0.97] transition"
        >
          🚀 Try Demo
        </button>
      </form>

      <p className="text-center text-sm text-[#64748b] mt-6">
        No account? <Link to="/signup" className="text-[#f97316] font-semibold">Sign up</Link>
      </p>
    </div>
  )
}
