import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { Mail, Lock, Shield, Zap, ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function Signup() {
  const nav = useNavigate()
  const { signUp, signInGoogle } = useStore()
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [pw2, setPw2] = useState('')
  const [showPw, setShowPw] = useState(false); const [err, setErr] = useState(''); const [loading, setLoading] = useState(false)

  const submit = async e => {
    e.preventDefault(); setErr('')
    if (pw !== pw2) { setErr('Passwords do not match'); return }
    if (pw.length < 6) { setErr('Min 6 characters'); return }
    setLoading(true)
    try { await signUp(email, pw, email.split('@')[0]); nav('/dashboard', { replace: true }) } catch(e) { setErr(e.message) }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col px-6 py-8">
      <button onClick={() => nav('/')} className="w-9 h-9 rounded-xl bg-[#1e293b] border border-[#334155] flex items-center justify-center mb-8"><ArrowLeft className="w-4 h-4 text-[#f1f5f9]"/></button>
      <h1 className="text-2xl font-bold text-[#f1f5f9] mb-1">Create Account</h1>
      <p className="text-sm text-[#64748b] mb-8">Start tracking your vehicles</p>
      <form onSubmit={submit} className="space-y-4 flex-1">
        {err && <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-xl px-4 py-3 text-sm text-[#ef4444]">{err}</div>}
        <div className="space-y-1"><label className="text-caps text-[#64748b]">Email</label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]"/><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full bg-[#1e293b] border border-[#334155] rounded-xl pl-10 pr-4 py-3 text-[#f1f5f9] text-sm placeholder:text-[#64748b]/40 focus:outline-none focus:border-[#f97316]/50" placeholder="your@email.com"/></div></div>
        <div className="space-y-1"><label className="text-caps text-[#64748b]">Password</label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]"/><input type={showPw?'text':'password'} value={pw} onChange={e=>setPw(e.target.value)} required className="w-full bg-[#1e293b] border border-[#334155] rounded-xl pl-10 pr-10 py-3 text-[#f1f5f9] text-sm placeholder:text-[#64748b]/40 focus:outline-none focus:border-[#f97316]/50" placeholder="Min 6 chars"/><button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2">{showPw?<EyeOff className="w-4 h-4 text-[#64748b]"/>:<Eye className="w-4 h-4 text-[#64748b]"/>}</button></div></div>
        <div className="space-y-1"><label className="text-caps text-[#64748b]">Confirm Password</label><div className="relative"><Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]"/><input type="password" value={pw2} onChange={e=>setPw2(e.target.value)} required className="w-full bg-[#1e293b] border border-[#334155] rounded-xl pl-10 pr-4 py-3 text-[#f1f5f9] text-sm placeholder:text-[#64748b]/40 focus:outline-none focus:border-[#f97316]/50" placeholder="Repeat password"/></div></div>
        <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-[#f97316] text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-[#f97316]/25 active:scale-[0.97] transition disabled:opacity-50"><Zap className="w-4 h-4"/>{loading?'Creating...':'Sign Up'}</button>
        <div className="flex items-center gap-3"><div className="flex-1 h-px bg-[#334155]"/><span className="text-[10px] text-[#64748b]">or</span><div className="flex-1 h-px bg-[#334155]"/></div>
        <button type="button" onClick={()=>signInGoogle().catch(e=>setErr(e.message))} className="w-full bg-[#1e293b] border border-[#334155] py-3.5 rounded-2xl text-sm font-semibold text-[#f1f5f9] active:scale-[0.97] transition">Google Sign In</button>
      </form>
      <p className="text-center text-sm text-[#64748b] mt-6">Have an account? <Link to="/login" className="text-[#f97316] font-semibold">Login</Link></p>
    </div>
  )
}
