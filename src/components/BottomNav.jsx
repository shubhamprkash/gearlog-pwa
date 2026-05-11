import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Fuel, Plus, Wrench, User } from 'lucide-react'

const tabs = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/fuel', icon: Fuel, label: 'Fuel' },
  { path: '/add', icon: Plus, label: '', fab: true },
  { path: '/service', icon: Wrench, label: 'Service' },
  { path: '/profile', icon: User, label: 'Profile' },
]

const hidePaths = ['/', '/login', '/signup', '/add-vehicle', '/add-fuel', '/add-service', '/add-trip', '/edit-profile']

export default function BottomNav() {
  const nav = useNavigate()
  const loc = useLocation()
  if (hidePaths.some(p => loc.pathname === p)) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f172a]/95 backdrop-blur-xl border-t border-[#334155]">
      <div className="max-w-md mx-auto flex items-center justify-around h-16" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        {tabs.map(t => {
          const active = loc.pathname.startsWith(t.path)
          if (t.fab) return (
            <button key="fab" onClick={() => nav('/add')}
              className="relative -mt-5 w-13 h-13 rounded-full bg-[#f97316] flex items-center justify-center shadow-lg shadow-[#f97316]/30 pulse-ring active:scale-90 transition"
              style={{ width: 52, height: 52 }}>
              <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
            </button>
          )
          return (
            <button key={t.path} onClick={() => nav(t.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition ${active ? 'text-[#f97316]' : 'text-[#64748b]'}`}>
              <t.icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
              <span className="text-[9px] font-medium">{t.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
