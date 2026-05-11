import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Fuel, Wrench, Route, Car, Plus, X } from 'lucide-react'

const actions = [
  { icon: Fuel, label: 'Fuel Log', desc: 'Record a fuel fill-up', path: '/add-fuel', color: 'text-accent' },
  { icon: Wrench, label: 'Service Log', desc: 'Log maintenance or repair', path: '/add-service', color: 'text-accent' },
  { icon: Route, label: 'Trip', desc: 'Record a journey', path: '/add-trip', color: 'text-accent' },
  { icon: Car, label: 'Vehicle', desc: 'Add a new vehicle', path: '/add-vehicle', color: 'text-accent' },
]

export default function AddScreen() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">Quick Add</h1>
            <p className="text-sm text-muted">What would you like to log?</p>
          </div>
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center">
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>

        <div className="space-y-3">
          {actions.map(a => (
            <button
              key={a.path}
              onClick={() => navigate(a.path)}
              className="w-full bg-dark-card rounded-2xl border border-dark-border p-4 flex items-center gap-4 text-left active:scale-[0.98] transition-transform hover:border-accent/30"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <a.icon className={`w-6 h-6 ${a.color}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-primary">{a.label}</h3>
                <p className="text-xs text-muted">{a.desc}</p>
              </div>
              <Plus className="w-5 h-5 text-muted" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
