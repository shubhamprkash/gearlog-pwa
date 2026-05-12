import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { Card, ScrollPage, Empty } from '../components/UI'
import VehiclePicker from '../components/VehiclePicker'
import { Fuel, Plus, Calendar, Trash2, Pencil } from 'lucide-react'
import { format } from 'date-fns'

export default function FuelPage() {
  const nav = useNavigate()
  const { vFuel, mileage, fuel, deleteFuelLog, activeVehicle } = useStore()

  return (
    <ScrollPage>
      <div className="px-5 pt-5 pb-3">
        <p className="text-[10px] text-[#64748b] font-medium mb-2">FUEL LOGS</p>
        <VehiclePicker onAddVehicle={() => nav('/add-vehicle')} />
      </div>

      {activeVehicle && (
        <div className="px-5 mb-4">
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3 text-center">
              <p className="text-lg font-bold text-[#f97316]">{mileage.current || '—'}</p>
              <p className="text-[8px] text-[#64748b]">LAST km/L</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-lg font-bold text-[#f1f5f9]">{mileage.average || '—'}</p>
              <p className="text-[8px] text-[#64748b]">AVG km/L</p>
            </Card>
            <Card className="p-3 text-center">
              <p className="text-lg font-bold text-[#f1f5f9]">₹{fuel.thisMonthCost.toLocaleString()}</p>
              <p className="text-[8px] text-[#64748b]">THIS MONTH</p>
            </Card>
          </div>
        </div>
      )}

      <div className="px-5">
        {vFuel.length === 0 ? (
          <Empty icon={Fuel} title="No fuel logs" message="Add your first fill-up to start tracking mileage" action={() => nav('/add-fuel')} actionLabel="Add Fuel Log" />
        ) : (
          <div className="space-y-2">
            {vFuel.map(f => {
              const sorted = [...vFuel].sort((a, b) => a.odometer - b.odometer)
              const idx = sorted.findIndex(x => x.id === f.id)
              let km_l = null
              if (idx > 0) {
                const dist = sorted[idx].odometer - sorted[idx - 1].odometer
                if (dist > 0 && f.litres > 0) km_l = (dist / f.litres).toFixed(1)
              }

              return (
                <Card key={f.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-[#64748b]" />
                      <span className="text-[11px] text-[#64748b]">{format(new Date(f.date), 'dd MMM yyyy')}</span>
                    </div>
                    {km_l && (
                      <span className="bg-[#f97316]/10 text-[#f97316] text-[10px] font-bold px-2 py-0.5 rounded-full">{km_l} km/L</span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div><p className="text-[8px] text-[#64748b]">Odometer</p><p className="text-sm font-bold text-[#f1f5f9]">{Number(f.odometer).toLocaleString()}</p></div>
                    <div><p className="text-[8px] text-[#64748b]">Litres</p><p className="text-sm font-bold text-[#f1f5f9]">{f.litres}L</p></div>
                    <div><p className="text-[8px] text-[#64748b]">Cost</p><p className="text-sm font-bold text-[#f1f5f9]">₹{Number(f.total_cost).toLocaleString()}</p></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-[#64748b]">{f.station_name || ''} {f.full_tank ? '• Full tank' : ''}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => nav('/add-fuel', { state: { edit: f } })}
                        className="text-[#64748b] hover:text-[#f97316] transition p-1.5 rounded-lg hover:bg-[#f97316]/10 active:scale-90"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { if (confirm('Delete this fuel entry?')) deleteFuelLog(f.id) }}
                        className="text-[#64748b] hover:text-[#ef4444] transition p-1.5 rounded-lg hover:bg-[#ef4444]/10 active:scale-90"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <button onClick={() => nav('/add-fuel')} className="fixed bottom-20 right-5 w-14 h-14 rounded-full bg-[#f97316] flex items-center justify-center shadow-lg shadow-[#f97316]/30 pulse-ring z-40 active:scale-90 transition">
        <Plus className="w-6 h-6 text-white" />
      </button>
    </ScrollPage>
  )
}
