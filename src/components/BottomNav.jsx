import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Car, Plus, Bell, User } from 'lucide-react'

const tabs = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/vehicles', icon: Car, label: 'Vehicles' },
  { path: '/add', icon: Plus, label: 'Add', isFab: true },
  { path: '/reminders', icon: Bell, label: 'Reminders' },
  { path: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  // Hide nav on auth/splash screens
  const hiddenPaths = ['/', '/login', '/signup', '/onboarding']
  if (hiddenPaths.includes(location.pathname)) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-xl border-t border-dark-border">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 h-16 pb-safe">
        {tabs.map(tab => {
          const isActive = location.pathname.startsWith(tab.path)
          const Icon = tab.icon

          if (tab.isFab) {
            return (
              <button
                key={tab.path}
                onClick={() => navigate('/add')}
                className="relative -mt-6 w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/30 fab-pulse active:scale-95 transition-transform"
              >
                <Plus className="w-7 h-7 text-white" strokeWidth={2.5} />
              </button>
            )
          }

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 transition-colors ${
                isActive ? 'text-accent' : 'text-muted'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
