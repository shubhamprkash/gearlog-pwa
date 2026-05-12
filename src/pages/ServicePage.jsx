import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { Card, ScrollPage, Empty } from '../components/UI'
import VehiclePicker from '../components/VehiclePicker'
import { Wrench, Plus, Calendar, Route, Trash2, Pencil } from 'lucide-react'
import { format } from 'date-fns'

export default function ServicePage() {
  const nav = useNavigate()
  const { vService, vTrips, activeVehicle, deleteServiceLog, deleteTrip } = useStore()

  return (
    <ScrollPage>
      <div className="px-5 pt-5 pb-3">
        <p className="text-[10px] text-[#64748b] font-medium mb-2">SERVICE & TRIPS</p>
        <VehiclePicker onAddVehicle={() => nav('/add-vehicle')} />
      </div>

      {/* Service Logs */}
      <div className="px-5 mb-4">
        <p className="text-caps text-[#64748b] mb-2">SERVICE HISTORY</p>
        {vService.length === 0 ? (
          <Empty icon={Wrench} title="No services logged" message="Record your first service" action={() => nav('/add-service')} actionLabel="Add Service" />
        ) : (
          <div className="space-y-2">
            {vService.map(s => (
              <Card key={s.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-[#64748b]" />
                    <span className="text-[11px] text-[#64748b]">{format(new Date(s.date), 'dd MMM yyyy')}</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#f97316]/10 text-[#f97316] capitalize">{s.service_type?.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <div><p className="text-[8px] text-[#64748b]">Odometer</p><p className="text-sm font-bold text-[#f1f5f9]">{Number(s.odometer).toLocaleString()} km</p></div>
                  {s.total_cost && <div className="text-right"><p className="text-[8px] text-[#64748b]">Cost</p><p className="text-sm font-bold text-[#f1f5f9]">₹{Number(s.total_cost).toLocaleString()}</p></div>}
                </div>
                {s.workshop_name && <p className="text-[10px] text-[#64748b] mb-1">🏪 {s.workshop_name}</p>}
                {s.parts_changed?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {s.parts_changed.map(p => <span key={p} className="text-[8px] font-medium px-1.5 py-0.5 bg-[#0f172a] rounded text-[#64748b] border border-[#334155]">{p}</span>)}
                  </div>
                )}
                <div className="flex justify-end items-center gap-1 pt-1 border-t border-[#334155]/50">
                  <button
                    onClick={() => nav('/add-service', { state: { edit: s } })}
                    className="text-[#64748b] hover:text-[#f97316] transition p-1.5 rounded-lg hover:bg-[#f97316]/10 active:scale-90"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { if (confirm('Delete this service record?')) deleteServiceLog(s.id) }}
                    className="text-[#64748b] hover:text-[#ef4444] transition p-1.5 rounded-lg hover:bg-[#ef4444]/10 active:scale-90"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Trips */}
      <div className="px-5 mb-4">
        <p className="text-caps text-[#64748b] mb-2">TRIP HISTORY</p>
        {vTrips.length === 0 ? (
          <Empty icon={Route} title="No trips logged" message="Record your first trip" action={() => nav('/add-trip')} actionLabel="Add Trip" />
        ) : (
          <div className="space-y-2">
            {vTrips.map(t => (
              <Card key={t.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#64748b]">{format(new Date(t.date), 'dd MMM yyyy')}</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${t.purpose === 'work' ? 'bg-blue-500/10 text-blue-400' : t.purpose === 'travel' ? 'bg-purple-500/10 text-purple-400' : 'bg-[#22c55e]/10 text-[#22c55e]'}`}>{t.purpose}</span>
                </div>
                <p className="text-sm font-semibold text-[#f1f5f9] mb-1">{t.from_location || '—'} → {t.to_location || '—'}</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-[#f97316]">{t.distance || (t.end_km - t.start_km)} km</p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => nav('/add-trip', { state: { edit: t } })}
                      className="text-[#64748b] hover:text-[#f97316] transition p-1.5 rounded-lg hover:bg-[#f97316]/10 active:scale-90"
                      title="Edit"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { if (confirm('Delete this trip?')) deleteTrip(t.id) }}
                      className="text-[#64748b] hover:text-[#ef4444] transition p-1.5 rounded-lg hover:bg-[#ef4444]/10 active:scale-90"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => nav('/add')} className="fixed bottom-20 right-5 w-14 h-14 rounded-full bg-[#f97316] flex items-center justify-center shadow-lg shadow-[#f97316]/30 pulse-ring z-40 active:scale-90 transition">
        <Plus className="w-6 h-6 text-white" />
      </button>
    </ScrollPage>
  )
}
