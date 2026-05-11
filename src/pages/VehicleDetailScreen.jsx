import React, { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import EmptyState from '../components/EmptyState'
import {
  ArrowLeft, Car, Bike, Fuel, Gauge, Wrench, Route, Settings, Shield,
  Leaf, Plus, Trash2, Calendar, MapPin, Flag, ChevronRight, Droplets,
  Filter, Link2, Disc, Battery, CircleDot
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { format } from 'date-fns'

const tabs = ['Overview', 'Fuel', 'Trips', 'Service', 'Parts']

export default function VehicleDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { vehicles, getVehicleFuelLogs, getVehicleServiceLogs, getVehicleTrips, deleteFuelLog } = useData()
  const [activeTab, setActiveTab] = useState('Overview')

  const vehicle = vehicles.find(v => v.id === id)
  const fuelLogs = useMemo(() => getVehicleFuelLogs(id), [id])
  const serviceLogs = useMemo(() => getVehicleServiceLogs(id), [id])
  const trips = useMemo(() => getVehicleTrips(id), [id])

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <EmptyState title="Vehicle not found" message="This vehicle doesn't exist" action={() => navigate('/vehicles')} actionLabel="Go Back" />
      </div>
    )
  }

  const oilChangeRemaining = Math.max(0, (vehicle.last_oil_change_km || 0) + (vehicle.oil_interval_km || 5000) - vehicle.current_odometer)
  const serviceRemaining = Math.max(0, (vehicle.last_service_km || 0) + (vehicle.service_interval_km || 10000) - vehicle.current_odometer)
  const oilProgress = Math.min(100, ((vehicle.oil_interval_km - oilChangeRemaining) / vehicle.oil_interval_km) * 100)
  const serviceProgress = Math.min(100, ((vehicle.service_interval_km - serviceRemaining) / vehicle.service_interval_km) * 100)

  const insuranceDays = vehicle.insurance_expiry ? Math.ceil((new Date(vehicle.insurance_expiry) - new Date()) / 86400000) : null
  const pucDays = vehicle.puc_expiry ? Math.ceil((new Date(vehicle.puc_expiry) - new Date()) / 86400000) : null

  const mileageData = fuelLogs.slice(0, 6).reverse().map((f, i) => ({
    name: `Refill ${i + 1}`,
    mileage: f.mileage || 0,
  }))

  const totalDistance = vehicle.current_odometer
  const totalFuelCost = fuelLogs.reduce((s, f) => s + (f.total_cost || 0), 0)
  const avgMileage = fuelLogs.filter(f => f.mileage).length > 0
    ? (fuelLogs.reduce((s, f) => s + (f.mileage || 0), 0) / fuelLogs.filter(f => f.mileage).length).toFixed(1)
    : '0'

  const partsData = [
    { name: 'Air Filter', icon: Filter, km: vehicle.air_filter_km, date: vehicle.air_filter_date, interval: 10000 },
    ...(vehicle.type === 'bike' ? [{ name: 'Chain', icon: Link2, km: vehicle.chain_km, date: vehicle.chain_date, interval: 5000 }] : []),
    { name: 'Brake Pads', icon: Disc, km: vehicle.brake_pads_km, date: null, interval: 15000 },
    { name: 'Tyres', icon: CircleDot, km: vehicle.tyres_km, date: null, interval: 20000 },
    { name: 'Battery', icon: Battery, km: null, date: vehicle.battery_date, interval: null },
  ]

  function getPartStatus(part) {
    if (!part.km) return 'ok'
    const kmSince = vehicle.current_odometer - part.km
    if (part.interval && kmSince > part.interval) return 'overdue'
    if (part.interval && kmSince > part.interval * 0.8) return 'due_soon'
    return 'ok'
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border px-5 pt-5 pb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-dark-bg/50 border border-dark-border flex items-center justify-center mb-4">
          <ArrowLeft className="w-4 h-4 text-primary" />
        </button>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
            {vehicle.type === 'bike' ? <Bike className="w-6 h-6 text-accent" /> : <Car className="w-6 h-6 text-accent" />}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-primary">{vehicle.nickname}</h1>
            <p className="text-xs text-muted">{vehicle.make} / {vehicle.year}</p>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-accent/10 text-accent uppercase">
            {vehicle.fuel_type}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-muted" />
          <span className="text-caps text-muted">Odometer</span>
          <span className="text-lg font-bold text-primary ml-auto">{Number(vehicle.current_odometer).toLocaleString()}km</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-3 overflow-x-auto hide-scrollbar">
        <div className="flex gap-1 bg-dark-card rounded-xl p-1 border border-dark-border min-w-fit">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-accent text-white shadow-md'
                  : 'text-muted hover:text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-5 pt-4">
        {activeTab === 'Overview' && (
          <div className="space-y-4">
            {/* Health Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-dark-card rounded-2xl border border-dark-border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-semibold text-muted">Oil Change Due</span>
                </div>
                <p className="text-xl font-bold text-primary mb-2">{oilChangeRemaining.toLocaleString()}km</p>
                <div className="w-full h-1.5 bg-dark-bg rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${oilProgress > 80 ? 'bg-danger' : oilProgress > 50 ? 'bg-warn' : 'bg-ok'}`}
                    style={{ width: `${oilProgress}%` }}
                  />
                </div>
              </div>
              <div className="bg-dark-card rounded-2xl border border-dark-border p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Wrench className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-semibold text-muted">Service Due</span>
                </div>
                <p className="text-xl font-bold text-primary mb-2">{serviceRemaining.toLocaleString()}km</p>
                <div className="w-full h-1.5 bg-dark-bg rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${serviceProgress > 80 ? 'bg-danger' : serviceProgress > 50 ? 'bg-warn' : 'bg-ok'}`}
                    style={{ width: `${serviceProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Compliance */}
            <div className="bg-dark-card rounded-2xl border border-dark-border p-4 space-y-3">
              <h3 className="text-caps text-muted">Compliance & Alerts</h3>
              {insuranceDays !== null && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-ok/10 flex items-center justify-center">
                    <Shield className={`w-4 h-4 ${insuranceDays < 7 ? 'text-danger' : insuranceDays < 30 ? 'text-warn' : 'text-ok'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-primary">Insurance Expiry</p>
                    <p className="text-[11px] text-muted">Valid until {format(new Date(vehicle.insurance_expiry), 'MMM dd, yyyy')}</p>
                  </div>
                  <span className={`text-xs font-bold ${insuranceDays < 7 ? 'text-danger' : insuranceDays < 30 ? 'text-warn' : 'text-ok'}`}>
                    {insuranceDays} Days Left
                  </span>
                </div>
              )}
              {pucDays !== null && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-ok/10 flex items-center justify-center">
                    <Leaf className={`w-4 h-4 ${pucDays < 7 ? 'text-danger' : pucDays < 30 ? 'text-warn' : 'text-ok'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-primary">PUC Expiry</p>
                    <p className="text-[11px] text-muted">Valid until {format(new Date(vehicle.puc_expiry), 'MMM dd, yyyy')}</p>
                  </div>
                  <span className={`text-xs font-bold ${pucDays < 7 ? 'text-danger' : pucDays < 30 ? 'text-warn' : 'text-ok'}`}>
                    {Math.max(0, pucDays)} Days Left
                  </span>
                </div>
              )}
            </div>

            {/* Mileage Trend */}
            {mileageData.length > 1 && (
              <div className="bg-dark-card rounded-2xl border border-dark-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-caps text-muted">Mileage Trend</h3>
                  <span className="text-xs text-accent font-semibold">Avg: {avgMileage} km/L</span>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={mileageData}>
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <YAxis hide domain={['dataMin - 3', 'dataMax + 3']} />
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, fontSize: 12 }}
                      labelStyle={{ color: '#64748b' }}
                    />
                    <Line type="monotone" dataKey="mileage" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316', r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Total Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Distance', value: `${totalDistance.toLocaleString()}km` },
                { label: 'Total Fuel Cost', value: `₹${totalFuelCost.toLocaleString()}` },
                { label: 'Avg Mileage', value: `${avgMileage}km/L` },
                { label: 'Total Services', value: serviceLogs.length.toString().padStart(2, '0') },
              ].map(s => (
                <div key={s.label} className="bg-dark-card rounded-2xl border border-dark-border p-3 text-center">
                  <p className="text-[10px] text-muted font-medium mb-1">{s.label}</p>
                  <p className="text-lg font-bold text-primary">{s.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Fuel' && (
          <div className="space-y-3 relative">
            {fuelLogs.length === 0 ? (
              <EmptyState icon={Fuel} title="No fuel logs" message="Add your first fuel entry" action={() => navigate('/add-fuel', { state: { vehicleId: id } })} actionLabel="Add Fuel Log" />
            ) : (
              fuelLogs.map(f => (
                <div key={f.id} className="bg-dark-card rounded-2xl border border-dark-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-muted" />
                      <span className="text-xs text-muted">{format(new Date(f.date), 'MMM dd, yyyy')}</span>
                    </div>
                    {f.mileage && (
                      <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {f.mileage} km/L
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div>
                      <p className="text-[9px] text-muted">Odometer</p>
                      <p className="text-sm font-bold text-primary">{Number(f.odometer).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted">Litres</p>
                      <p className="text-sm font-bold text-primary">{f.litres}L</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted">Cost</p>
                      <p className="text-sm font-bold text-primary">₹{Number(f.total_cost).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-muted">{f.station_name || ''}</span>
                    <button onClick={() => deleteFuelLog(f.id)} className="text-muted hover:text-danger transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
            {/* FAB */}
            <button
              onClick={() => navigate('/add-fuel', { state: { vehicleId: id } })}
              className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/30 fab-pulse z-40"
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          </div>
        )}

        {activeTab === 'Trips' && (
          <div className="space-y-3 relative">
            {trips.length === 0 ? (
              <EmptyState icon={Route} title="No trips logged" message="Record your first trip" action={() => navigate('/add-trip', { state: { vehicleId: id } })} actionLabel="Add Trip" />
            ) : (
              trips.map(t => (
                <div key={t.id} className="bg-dark-card rounded-2xl border border-dark-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-muted" />
                      <span className="text-xs text-muted">{format(new Date(t.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                      t.purpose === 'work' ? 'bg-blue-500/10 text-blue-400' :
                      t.purpose === 'travel' ? 'bg-purple-500/10 text-purple-400' :
                      'bg-ok/10 text-ok'
                    }`}>
                      {t.purpose}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3.5 h-3.5 text-accent" />
                    <span className="text-sm font-semibold text-primary">{t.from_location}</span>
                    <ChevronRight className="w-3 h-3 text-muted" />
                    <Flag className="w-3.5 h-3.5 text-accent" />
                    <span className="text-sm font-semibold text-primary">{t.to_location}</span>
                  </div>
                  <p className="text-lg font-bold text-accent">{t.distance || (t.end_km - t.start_km)} km</p>
                </div>
              ))
            )}
            <button
              onClick={() => navigate('/add-trip', { state: { vehicleId: id } })}
              className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/30 fab-pulse z-40"
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          </div>
        )}

        {activeTab === 'Service' && (
          <div className="space-y-3 relative">
            {serviceLogs.length === 0 ? (
              <EmptyState icon={Wrench} title="No service records" message="Log your first service" action={() => navigate('/add-service', { state: { vehicleId: id } })} actionLabel="Add Service" />
            ) : (
              serviceLogs.map(s => (
                <div key={s.id} className="bg-dark-card rounded-2xl border border-dark-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-muted" />
                      <span className="text-xs text-muted">{format(new Date(s.date), 'MMM dd, yyyy')}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent capitalize">
                      {s.service_type?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-[9px] text-muted">Odometer</p>
                      <p className="text-sm font-bold text-primary">{Number(s.odometer).toLocaleString()} km</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-muted">Cost</p>
                      <p className="text-sm font-bold text-primary">₹{Number(s.total_cost || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  {s.workshop_name && <p className="text-[11px] text-muted mb-2">🏪 {s.workshop_name}</p>}
                  {s.parts_changed?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {s.parts_changed.map(p => (
                        <span key={p} className="text-[9px] font-medium px-1.5 py-0.5 bg-dark-bg rounded-md text-muted border border-dark-border">
                          {p}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
            <button
              onClick={() => navigate('/add-service', { state: { vehicleId: id } })}
              className="fixed bottom-24 right-5 w-14 h-14 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/30 fab-pulse z-40"
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          </div>
        )}

        {activeTab === 'Parts' && (
          <div className="grid grid-cols-2 gap-3">
            {partsData.map(part => {
              const status = getPartStatus(part)
              const Icon = part.icon
              return (
                <div key={part.name} className="bg-dark-card rounded-2xl border border-dark-border p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      status === 'overdue' ? 'bg-danger/10' : status === 'due_soon' ? 'bg-warn/10' : 'bg-ok/10'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        status === 'overdue' ? 'text-danger' : status === 'due_soon' ? 'text-warn' : 'text-ok'
                      }`} />
                    </div>
                    <span className="text-xs font-semibold text-primary">{part.name}</span>
                  </div>
                  {part.km && (
                    <p className="text-[10px] text-muted">Last: {Number(part.km).toLocaleString()} km</p>
                  )}
                  {part.date && (
                    <p className="text-[10px] text-muted">{format(new Date(part.date), 'MMM dd, yyyy')}</p>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      status === 'overdue' ? 'bg-danger' : status === 'due_soon' ? 'bg-warn' : 'bg-ok'
                    }`} />
                    <span className={`text-[9px] font-semibold capitalize ${
                      status === 'overdue' ? 'text-danger' : status === 'due_soon' ? 'text-warn' : 'text-ok'
                    }`}>
                      {status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
