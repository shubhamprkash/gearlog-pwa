import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ChevronRight, Gauge, Fuel, Settings } from 'lucide-react'

export default function SplashScreen() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => setShow(true), 100)
    if (user) navigate('/home', { replace: true })
  }, [user])

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-8 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className={`relative z-10 flex flex-col items-center transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center shadow-2xl shadow-accent/30">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="20" stroke="white" strokeWidth="2.5" fill="none" />
              <circle cx="28" cy="28" r="6" fill="white" />
              <line x1="28" y1="8" x2="28" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="28" y1="42" x2="28" y2="48" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="8" y1="28" x2="14" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="42" y1="28" x2="48" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          {/* Glow */}
          <div className="absolute inset-0 w-24 h-24 rounded-3xl bg-accent/20 blur-2xl -z-10" />
        </div>

        {/* App name */}
        <h1 className="text-4xl font-black text-primary tracking-tight mb-2">
          Gear<span className="text-accent">Log</span>
        </h1>
        <p className="text-sm text-muted font-medium mb-12 tracking-wide">
          Every km. Every service. Every cost.
        </p>

        {/* Stats preview */}
        <div className="flex gap-6 mb-12">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center mb-2">
              <Gauge className="w-5 h-5 text-accent" />
            </div>
            <span className="text-lg font-bold text-primary">12,482</span>
            <span className="text-[10px] text-muted font-medium">Mileage</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center mb-2">
              <Fuel className="w-5 h-5 text-accent" />
            </div>
            <span className="text-lg font-bold text-primary">84%</span>
            <span className="text-[10px] text-muted font-medium">Fuel</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center mb-2">
              <Settings className="w-5 h-5 text-accent" />
            </div>
            <span className="text-lg font-bold text-primary">100%</span>
            <span className="text-[10px] text-muted font-medium">Health</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs text-muted/70 font-medium mb-8">Precision Fleet Tracking</p>

        {/* CTA Buttons */}
        <button
          onClick={() => navigate('/signup')}
          className="w-full max-w-xs flex items-center justify-center gap-2 bg-accent text-white py-3.5 px-6 rounded-2xl font-semibold text-sm shadow-lg shadow-accent/25 active:scale-[0.98] transition-transform mb-3"
        >
          Get Started
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigate('/login')}
          className="w-full max-w-xs flex items-center justify-center gap-2 bg-dark-card border border-dark-border text-primary py-3.5 px-6 rounded-2xl font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          Login
        </button>
      </div>

      {/* System status */}
      <div className={`absolute bottom-8 flex items-center gap-2 transition-all duration-700 delay-500 ${show ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-2 h-2 rounded-full bg-ok animate-pulse" />
        <span className="text-[10px] text-muted font-medium">System Status: Operational</span>
      </div>
    </div>
  )
}
