import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { ChevronRight } from 'lucide-react'

export default function Splash() {
  const nav = useNavigate()
  const { user } = useStore()
  const [show, setShow] = useState(false)
  useEffect(() => { setTimeout(() => setShow(true), 100); if (user) nav('/dashboard', { replace: true }) }, [user])

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center px-8 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#f97316]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#f97316]/5 rounded-full blur-3xl" />
      </div>
      <div className={`relative z-10 flex flex-col items-center transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#f97316] to-[#ea580c] flex items-center justify-center shadow-2xl shadow-[#f97316]/30 mb-6">
          <svg width="44" height="44" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="28" r="18" stroke="white" strokeWidth="2.5" fill="none"/><circle cx="28" cy="28" r="5" fill="white"/><line x1="28" y1="10" x2="28" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/><line x1="28" y1="40" x2="28" y2="46" stroke="white" strokeWidth="2" strokeLinecap="round"/><line x1="10" y1="28" x2="16" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round"/><line x1="40" y1="28" x2="46" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <h1 className="text-3xl font-black text-[#f1f5f9] tracking-tight mb-1">Gear<span className="text-[#f97316]">Log</span></h1>
        <p className="text-xs text-[#64748b] font-medium mb-10">Every km. Every service. Every cost.</p>
        <button onClick={() => nav('/signup')} className="w-full max-w-[280px] flex items-center justify-center gap-2 bg-[#f97316] text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-[#f97316]/25 active:scale-[0.97] transition mb-3">
          Get Started <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={() => nav('/login')} className="w-full max-w-[280px] bg-[#1e293b] border border-[#334155] text-[#f1f5f9] py-3.5 rounded-2xl font-semibold text-sm active:scale-[0.97] transition">
          Login
        </button>
      </div>
    </div>
  )
}
