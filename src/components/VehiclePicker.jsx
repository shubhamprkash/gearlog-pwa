import React from 'react'
import { useStore } from '../lib/store'
import { Car, Bike, Zap, Plus, ChevronDown, Check } from 'lucide-react'
import { HealthRing } from './UI'

const iconMap = { car: Car, bike: Bike, scooter: Bike, ev: Zap }

export default function VehiclePicker({ onAddVehicle }) {
  const { vehicles, activeVehicleId, setActiveVehicleId, health } = useStore()
  const [open, setOpen] = React.useState(false)
  const active = vehicles.find(v => v.id === activeVehicleId)
  const Icon = active ? (iconMap[active.type] || Car) : Car

  if (vehicles.length === 0) {
    return (
      <button onClick={onAddVehicle}
        className="w-full bg-[#1e293b] border-2 border-dashed border-[#334155] rounded-2xl p-4 flex items-center justify-center gap-2 text-[#64748b] active:scale-[0.98] transition">
        <Plus className="w-5 h-5" /> <span className="text-sm font-semibold">Add Your First Vehicle</span>
      </button>
    )
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="w-full bg-[#1e293b] border border-[#334155] rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.99] transition">
        <div className="w-11 h-11 rounded-xl bg-[#f97316]/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#f97316]" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <h3 className="text-sm font-bold text-[#f1f5f9] truncate">{active?.nickname || 'Select Vehicle'}</h3>
          <p className="text-[10px] text-[#64748b] truncate">{active ? `${active.make} ${active.model} • ${Number(active.current_odometer || 0).toLocaleString()} km` : ''}</p>
        </div>
        <HealthRing percent={health} size={38} stroke={3} />
        <ChevronDown className={`w-4 h-4 text-[#64748b] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1e293b] border border-[#334155] rounded-2xl z-50 shadow-2xl overflow-hidden">
            {vehicles.map(v => {
              const VIcon = iconMap[v.type] || Car
              const isActive = v.id === activeVehicleId
              return (
                <button key={v.id} onClick={() => { setActiveVehicleId(v.id); setOpen(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${isActive ? 'bg-[#f97316]/10' : 'hover:bg-[#334155]/30'}`}>
                  <VIcon className={`w-4 h-4 ${isActive ? 'text-[#f97316]' : 'text-[#64748b]'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isActive ? 'text-[#f97316]' : 'text-[#f1f5f9]'}`}>{v.nickname}</p>
                    <p className="text-[10px] text-[#64748b]">{v.make} {v.model}</p>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-[#f97316]" />}
                </button>
              )
            })}
            {vehicles.length < 4 && (
              <button onClick={() => { setOpen(false); onAddVehicle?.() }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left border-t border-[#334155] text-[#64748b] hover:bg-[#334155]/30">
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Add Vehicle</span>
                <span className="ml-auto text-[9px] bg-[#334155] px-1.5 py-0.5 rounded">{vehicles.length}/4</span>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
