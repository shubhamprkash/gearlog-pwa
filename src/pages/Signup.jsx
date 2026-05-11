import React, { useState, useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { Mail, Lock, Shield, Zap, ArrowLeft, Eye, EyeOff, Check, X, AlertCircle } from 'lucide-react'

// ── Validation helpers ──────────────────────────
function validateEmail(v) {
  if (!v) return null // no error when empty (not yet touched)
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!re.test(v)) return 'Enter a valid email address'
  return ''
}

function getPasswordChecks(pw) {
  return [
    { label: 'At least 8 characters', pass: pw.length >= 8 },
    { label: 'One uppercase letter', pass: /[A-Z]/.test(pw) },
    { label: 'One lowercase letter', pass: /[a-z]/.test(pw) },
    { label: 'One number', pass: /[0-9]/.test(pw) },
    { label: 'One special character (!@#$...)', pass: /[^a-zA-Z0-9]/.test(pw) },
  ]
}

function passwordStrength(checks) {
  const passed = checks.filter(c => c.pass).length
  if (passed <= 1) return { label: 'Very Weak', color: '#ef4444', percent: 20 }
  if (passed === 2) return { label: 'Weak', color: '#ef4444', percent: 40 }
  if (passed === 3) return { label: 'Fair', color: '#eab308', percent: 60 }
  if (passed === 4) return { label: 'Strong', color: '#22c55e', percent: 80 }
  return { label: 'Very Strong', color: '#22c55e', percent: 100 }
}

export default function Signup() {
  const nav = useNavigate()
  const { signUp, signInGoogle } = useStore()

  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  // Track if fields have been interacted with
  const [touched, setTouched] = useState({ email: false, pw: false, pw2: false })
  const touch = (field) => setTouched(p => ({ ...p, [field]: true }))

  // ── Live validations ──────────────────────────
  const emailErr = useMemo(() => touched.email ? validateEmail(email) : null, [email, touched.email])

  const pwChecks = useMemo(() => getPasswordChecks(pw), [pw])
  const pwStrength = useMemo(() => passwordStrength(pwChecks), [pwChecks])
  const allChecksPassed = pwChecks.every(c => c.pass)

  const pw2Err = useMemo(() => {
    if (!touched.pw2 || !pw2) return null
    if (pw2 !== pw) return 'Passwords do not match'
    return ''
  }, [pw, pw2, touched.pw2])

  // ── Can submit? ───────────────────────────────
  const canSubmit = email && emailErr === '' && allChecksPassed && pw2 === pw && !loading

  const submit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, pw: true, pw2: true })
    setErr('')

    // Final check
    const finalEmailErr = validateEmail(email)
    if (finalEmailErr) { setErr(finalEmailErr); return }
    if (!allChecksPassed) { setErr('Password does not meet all requirements'); return }
    if (pw !== pw2) { setErr('Passwords do not match'); return }

    setLoading(true)
    try {
      await signUp(email, pw, email.split('@')[0])
      nav('/dashboard', { replace: true })
    } catch (e) {
      setErr(e.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col px-6 py-8">
      <button onClick={() => nav('/')} className="w-9 h-9 rounded-xl bg-[#1e293b] border border-[#334155] flex items-center justify-center mb-8">
        <ArrowLeft className="w-4 h-4 text-[#f1f5f9]" />
      </button>

      <h1 className="text-2xl font-bold text-[#f1f5f9] mb-1">Create Account</h1>
      <p className="text-sm text-[#64748b] mb-8">Start tracking your vehicles</p>

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
          <label className="text-caps text-[#64748b]">Email Address</label>
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
            {/* Status icon */}
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
          <label className="text-caps text-[#64748b]">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <input
              type={showPw ? 'text' : 'password'}
              value={pw}
              onChange={e => setPw(e.target.value)}
              onBlur={() => touch('pw')}
              placeholder="Create a strong password"
              required
              className={`w-full bg-[#1e293b] border rounded-xl pl-10 pr-10 py-3 text-[#f1f5f9] text-sm placeholder:text-[#64748b]/40 focus:outline-none transition ${
                pw && allChecksPassed ? 'border-[#22c55e]/50' :
                touched.pw && pw && !allChecksPassed ? 'border-[#eab308]/50' :
                'border-[#334155] focus:border-[#f97316]/50'
              }`}
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">
              {showPw ? <EyeOff className="w-4 h-4 text-[#64748b]" /> : <Eye className="w-4 h-4 text-[#64748b]" />}
            </button>
          </div>

          {/* Strength bar + label */}
          {pw && (
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-[#0f172a] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pwStrength.percent}%`, background: pwStrength.color }} />
                </div>
                <span className="text-[10px] font-semibold" style={{ color: pwStrength.color }}>{pwStrength.label}</span>
              </div>

              {/* Checklist */}
              <div className="grid grid-cols-1 gap-1">
                {pwChecks.map(c => (
                  <div key={c.label} className="flex items-center gap-1.5">
                    {c.pass
                      ? <Check className="w-3 h-3 text-[#22c55e]" />
                      : <X className="w-3 h-3 text-[#64748b]" />
                    }
                    <span className={`text-[10px] ${c.pass ? 'text-[#22c55e]' : 'text-[#64748b]'}`}>{c.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-caps text-[#64748b]">Confirm Password</label>
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
            <input
              type={showPw2 ? 'text' : 'password'}
              value={pw2}
              onChange={e => setPw2(e.target.value)}
              onBlur={() => touch('pw2')}
              placeholder="Repeat your password"
              required
              className={`w-full bg-[#1e293b] border rounded-xl pl-10 pr-10 py-3 text-[#f1f5f9] text-sm placeholder:text-[#64748b]/40 focus:outline-none transition ${
                pw2 && pw2 === pw ? 'border-[#22c55e]/50' :
                pw2Err ? 'border-[#ef4444]/50' :
                'border-[#334155] focus:border-[#f97316]/50'
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button type="button" onClick={() => setShowPw2(!showPw2)}>
                {showPw2 ? <EyeOff className="w-4 h-4 text-[#64748b]" /> : <Eye className="w-4 h-4 text-[#64748b]" />}
              </button>
            </div>
          </div>
          {pw2Err && <p className="text-[11px] text-[#ef4444] flex items-center gap-1"><X className="w-3 h-3" />{pw2Err}</p>}
          {touched.pw2 && pw2 && pw2 === pw && <p className="text-[11px] text-[#22c55e] flex items-center gap-1"><Check className="w-3 h-3" />Passwords match</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 bg-[#f97316] text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-[#f97316]/25 active:scale-[0.97] transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Zap className="w-4 h-4" />
          {loading ? 'Creating account...' : 'Sign Up'}
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
      </form>

      <p className="text-center text-sm text-[#64748b] mt-6">
        Have an account? <Link to="/login" className="text-[#f97316] font-semibold">Login</Link>
      </p>
    </div>
  )
}
