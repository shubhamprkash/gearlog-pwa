import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Fuel, Wrench, Route, Car, Plus, X } from 'lucide-react'
import { Card } from '../components/UI'

const items = [
  { icon: Fuel, label: 'Fuel Log', desc: 'Record a fill-up', path: '/add-fuel' },
  { icon: Wrench, label: 'Service', desc: 'Log maintenance', path: '/add-service' },
  { icon: Route, label: 'Trip', desc: 'Record a journey', path: '/add-trip' },
  { icon: Car, label: 'Vehicle', desc: 'Add a new vehicle', path: '/add-vehicle' },
]

export default function AddQuick() {
  const nav = useNavigate()
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-between mb-6">
          <div><h1 className="text-xl font-bold text-[#f1f5f9]">Quick Add</h1><p className="text-xs text-[#64748b]">What would you like to log?</p></div>
          <button onClick={() => nav(-1)} className="w-9 h-9 rounded-xl bg-[#1e293b] border border-[#334155] flex items-center justify-center"><X className="w-4 h-4 text-[#f1f5f9]" /></button>
        </div>
        <div className="space-y-2.5">
          {items.map(a => (
            <Card key={a.path} onClick={() => nav(a.path)} className="p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#f97316]/10 flex items-center justify-center"><a.icon className="w-5 h-5 text-[#f97316]" /></div>
              <div className="flex-1"><h3 className="text-sm font-semibold text-[#f1f5f9]">{a.label}</h3><p className="text-[10px] text-[#64748b]">{a.desc}</p></div>
              <Plus className="w-4 h-4 text-[#64748b]" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
