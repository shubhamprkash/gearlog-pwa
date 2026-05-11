import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import VehiclePicker from '../components/VehiclePicker'
import { Card, HealthRing, StatusDot, ScrollPage, Empty } from '../components/UI'
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts'
import { format } from 'date-fns'
import {
  Gauge, Fuel, Droplets, Wrench, Wind, Disc, CircleDot, Link2, Battery,
  Shield, Leaf, AlertTriangle, TrendingUp, IndianRupee, Route, Calendar, ChevronRight
} from 'lucide-react'

const partIcons = { droplets: Droplets, wrench: Wrench, wind: Wind, disc: Disc, circle: CircleDot, link: Link2, battery: Battery, shield: Shield, leaf: Leaf }

export default function Dashboard() {
  const nav = useNavigate()
  const { activeVehicle, vehicles, mileage, fuel, parts, health, reminders, costKm, vFuel, vService, vTrips } = useStore()

  if (!activeVehicle && vehicles.length === 0) {
    return (
      <ScrollPage>
        <div className="px-5 pt-6 mb-4">
          <h1 className="text-xl font-bold text-[#f1f5f9] mb-1">Gear<span className="text-[#f97316]">Log</span></h1>
        </div>
        <Empty icon={Gauge} title="No vehicles yet" message="Add your first bike or car to start tracking" action={() => nav('/add-vehicle')} actionLabel="Add Vehicle" />
      </ScrollPage>
    )
  }

  const partsList = Object.entries(parts).filter(([, p]) => p.status !== 'unknown')
  const overdueCount = partsList.filter(([, p]) => p.status === 'overdue').length
  const soonCount = partsList.filter(([, p]) => p.status === 'due_soon').length

  return (
    <ScrollPage>
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <p className="text-[10px] text-[#64748b] font-medium mb-2">ACTIVE VEHICLE</p>
        <VehiclePicker onAddVehicle={() => nav('/add-vehicle')} />
      </div>

      {/* Quick Stats */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-3 gap-2">
          <Card className="p-3 text-center">
            <Gauge className="w-4 h-4 text-[#f97316] mx-auto mb-1" />
            <p className="text-lg font-bold text-[#f1f5f9]">{Number(activeVehicle?.current_odometer || 0).toLocaleString()}</p>
            <p className="text-[8px] text-[#64748b] font-medium">KM</p>
          </Card>
          <Card className="p-3 text-center">
            <TrendingUp className="w-4 h-4 text-[#f97316] mx-auto mb-1" />
            <p className="text-lg font-bold text-[#f1f5f9]">{mileage.average || '—'}</p>
            <p className="text-[8px] text-[#64748b] font-medium">AVG km/L</p>
          </Card>
          <Card className="p-3 text-center">
            <IndianRupee className="w-4 h-4 text-[#f97316] mx-auto mb-1" />
            <p className="text-lg font-bold text-[#f1f5f9]">{costKm ? `₹${costKm}` : '—'}</p>
            <p className="text-[8px] text-[#64748b] font-medium">PER KM</p>
          </Card>
        </div>
      </div>

      {/* Health Overview */}
      <div className="px-5 mb-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-caps text-[#64748b] mb-0.5">Vehicle Health</p>
              <div className="flex items-center gap-2">
                <span className={`text-xl font-bold ${health >= 75 ? 'text-[#22c55e]' : health >= 40 ? 'text-[#eab308]' : 'text-[#ef4444]'}`}>{health}%</span>
                {overdueCount > 0 && <span className="text-[9px] bg-[#ef4444]/10 text-[#ef4444] px-1.5 py-0.5 rounded-full font-semibold">{overdueCount} overdue</span>}
                {soonCount > 0 && <span className="text-[9px] bg-[#eab308]/10 text-[#eab308] px-1.5 py-0.5 rounded-full font-semibold">{soonCount} due soon</span>}
              </div>
            </div>
            <HealthRing percent={health} size={52} stroke={4} />
          </div>
          <div className="w-full h-2 bg-[#0f172a] rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${health >= 75 ? 'bg-[#22c55e]' : health >= 40 ? 'bg-[#eab308]' : 'bg-[#ef4444]'}`} style={{ width: `${health}%` }} />
          </div>
        </Card>
      </div>

      {/* Reminders (within 2 weeks only) */}
      {reminders.length > 0 && (
        <div className="px-5 mb-4">
          <p className="text-caps text-[#64748b] mb-2">⚠ ATTENTION NEEDED</p>
          <div className="space-y-2">
            {reminders.slice(0, 4).map((r, i) => {
              const Icon = partIcons[r.icon] || AlertTriangle
              const isOverdue = r.urgency === 'overdue'
              return (
                <Card key={i} className={`p-3 flex items-center gap-3 ${isOverdue ? 'border-[#ef4444]/30 bg-[#ef4444]/5' : 'border-[#eab308]/30 bg-[#eab308]/5'}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isOverdue ? 'bg-[#ef4444]/15' : 'bg-[#eab308]/15'}`}>
                    <Icon className={`w-4 h-4 ${isOverdue ? 'text-[#ef4444]' : 'text-[#eab308]'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#f1f5f9] truncate">{r.label}</p>
                    <p className="text-[10px] text-[#64748b]">{r.message}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isOverdue ? 'bg-[#ef4444]/15 text-[#ef4444]' : 'bg-[#eab308]/15 text-[#eab308]'}`}>
                    {r.urgency === 'overdue' ? 'OVERDUE' : 'SOON'}
                  </span>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Mileage Trend */}
      {mileage.trend.length > 1 && (
        <div className="px-5 mb-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-caps text-[#64748b]">Mileage Trend</p>
              <div className="flex items-center gap-3 text-[10px] text-[#64748b]">
                <span>Best: <b className="text-[#22c55e]">{mileage.best}</b></span>
                <span>Worst: <b className="text-[#ef4444]">{mileage.worst}</b></span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={mileage.trend}>
                <YAxis hide domain={['dataMin - 3', 'dataMax + 3']} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, fontSize: 11 }} labelStyle={{ color: '#64748b' }} formatter={v => [`${v} km/L`]} />
                <Line type="monotone" dataKey="kmpl" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex justify-between mt-1 text-[8px] text-[#64748b]">
              <span>Oldest</span><span>Latest</span>
            </div>
          </Card>
        </div>
      )}

      {/* Parts Health Grid */}
      {partsList.length > 0 && (
        <div className="px-5 mb-4">
          <p className="text-caps text-[#64748b] mb-2">PARTS & MAINTENANCE</p>
          <div className="grid grid-cols-2 gap-2">
            {partsList.map(([key, part]) => {
              const Icon = partIcons[part.icon] || Wrench
              const color = part.status === 'overdue' ? '#ef4444' : part.status === 'due_soon' ? '#eab308' : '#22c55e'
              return (
                <Card key={key} className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
                      <Icon className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                    <span className="text-[11px] font-semibold text-[#f1f5f9]">{part.label}</span>
                  </div>
                  {part.remaining != null ? (
                    <>
                      <p className="text-xs text-[#64748b]">{part.remaining.toLocaleString()} km left</p>
                      <div className="w-full h-1 bg-[#0f172a] rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.min(100, part.percent)}%`, background: color }} />
                      </div>
                    </>
                  ) : part.daysLeft != null ? (
                    <p className="text-xs text-[#64748b]">{part.daysLeft > 0 ? `${part.daysLeft} days left` : `Expired ${Math.abs(part.daysLeft)}d ago`}</p>
                  ) : (
                    <p className="text-xs text-[#64748b]">No data</p>
                  )}
                  <div className="flex items-center gap-1 mt-1.5">
                    <StatusDot status={part.status} />
                    <span className="text-[8px] font-semibold capitalize" style={{ color }}>{part.status.replace('_', ' ')}</span>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Fuel Stats */}
      <div className="px-5 mb-4">
        <p className="text-caps text-[#64748b] mb-2">FUEL COSTS</p>
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <div><p className="text-[9px] text-[#64748b]">This Month</p><p className="text-base font-bold text-[#f1f5f9]">₹{fuel.thisMonthCost.toLocaleString()}</p></div>
            <div><p className="text-[9px] text-[#64748b]">Last Month</p><p className="text-base font-bold text-[#f1f5f9]">₹{fuel.lastMonthCost.toLocaleString()}</p></div>
            <div><p className="text-[9px] text-[#64748b]">Total Spent</p><p className="text-base font-bold text-[#f1f5f9]">₹{fuel.totalCost.toLocaleString()}</p></div>
            <div><p className="text-[9px] text-[#64748b]">Avg ₹/Litre</p><p className="text-base font-bold text-[#f1f5f9]">₹{fuel.avgCostPerLitre}</p></div>
          </div>
        </Card>
      </div>

      {/* Recent Logs */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-caps text-[#64748b]">RECENT ENTRIES</p>
          <button onClick={() => nav('/fuel')} className="text-[10px] text-[#f97316] font-semibold flex items-center gap-0.5">View all <ChevronRight className="w-3 h-3" /></button>
        </div>
        <div className="space-y-1.5">
          {vFuel.slice(0, 3).map(f => (
            <Card key={f.id} className="p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#f97316]/10 flex items-center justify-center"><Fuel className="w-3.5 h-3.5 text-[#f97316]" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#f1f5f9]">{f.litres}L fuel</p>
                <p className="text-[9px] text-[#64748b]">{format(new Date(f.date), 'dd MMM')} • {Number(f.odometer).toLocaleString()} km</p>
              </div>
              <span className="text-xs font-bold text-[#f1f5f9]">₹{Number(f.total_cost).toLocaleString()}</span>
            </Card>
          ))}
          {vService.slice(0, 2).map(s => (
            <Card key={s.id} className="p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#22c55e]/10 flex items-center justify-center"><Wrench className="w-3.5 h-3.5 text-[#22c55e]" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#f1f5f9] capitalize">{s.service_type?.replace('_', ' ')}</p>
                <p className="text-[9px] text-[#64748b]">{format(new Date(s.date), 'dd MMM')} • {s.workshop_name || ''}</p>
              </div>
              {s.total_cost && <span className="text-xs font-bold text-[#f1f5f9]">₹{Number(s.total_cost).toLocaleString()}</span>}
            </Card>
          ))}
        </div>
      </div>
    </ScrollPage>
  )
}
