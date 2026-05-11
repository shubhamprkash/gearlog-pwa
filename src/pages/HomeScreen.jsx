import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import HealthRing from '../components/HealthRing'
import { SkeletonVehicleCard } from '../components/Skeleton'
import {
  Bell, Plus, ChevronRight, Car, Bike, Fuel, AlertTriangle,
  Route, Wrench, Sparkles, Gauge, TrendingUp, DollarSign
} from 'lucide-react'
import { format } from 'date-fns'

export default function HomeScreen() {
  const navigate = useNavigate()
  const { profile } = useAuth()
  const { vehicles, reminders, recentActivity, totalFuelCostThisMonth, avgMileage, loading } = useData()

  const activeReminders = reminders.filter(r => r.status === 'active' && (r.urgency === 'overdue' || r.urgency === 'soon')).slice(0, 3)
  const firstName = profile?.full_name?.split(' ')[0] || 'Driver'
  const activeReminderCount = reminders.filter(r => r.status === 'active').length

  const activityIcons = {
    fuel: Fuel,
    trip: Route,
    service: Wrench,
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted font-medium">Welcome back,</p>
          <h1 className="text-2xl font-bold text-primary">Hi {firstName} 👋</h1>
        </div>
        <button
          onClick={() => navigate('/reminders')}
          className="relative w-11 h-11 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center"
        >
          <Bell className="w-5 h-5 text-primary" />
          {activeReminderCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center text-[10px] font-bold text-white">
              {activeReminderCount}
            </span>
          )}
        </button>
      </div>

      {/* Maintenance Health Bar */}
      <div className="px-5 mb-4">
        <div className="bg-dark-card rounded-2xl border border-dark-border p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-caps text-muted mb-1">Maintenance Health</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-ok">72%</span>
                <span className="text-xs text-muted">Fleet Ready</span>
                <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full font-medium">{activeReminderCount} Alerts</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-center">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-0.5">
                  <Wrench className="w-4 h-4 text-accent" />
                </div>
                <span className="text-xs font-bold text-primary">12</span>
                <p className="text-[8px] text-muted">Services</p>
              </div>
              <div className="text-center">
                <div className="w-9 h-9 rounded-lg bg-danger/10 flex items-center justify-center mb-0.5">
                  <AlertTriangle className="w-4 h-4 text-danger" />
                </div>
                <span className="text-xs font-bold text-primary">1</span>
                <p className="text-[8px] text-muted">Overdue</p>
              </div>
            </div>
          </div>
          <div className="w-full h-2 bg-dark-bg rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-ok to-ok/70 rounded-full" style={{ width: '72%' }} />
          </div>
        </div>
      </div>

      {/* Quick Stats Strip */}
      <div className="px-5 mb-4">
        <div className="flex gap-3">
          <div className="flex-1 bg-dark-card rounded-2xl border border-dark-border p-3 text-center">
            <Car className="w-4 h-4 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold text-primary">{vehicles.length.toString().padStart(2, '0')}</p>
            <p className="text-[9px] text-muted font-medium">Vehicles</p>
          </div>
          <div className="flex-1 bg-dark-card rounded-2xl border border-dark-border p-3 text-center">
            <DollarSign className="w-4 h-4 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold text-primary">₹{(totalFuelCostThisMonth / 1000).toFixed(0)}k</p>
            <p className="text-[9px] text-muted font-medium">Fuel/Mo</p>
          </div>
          <div className="flex-1 bg-dark-card rounded-2xl border border-dark-border p-3 text-center">
            <Gauge className="w-4 h-4 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold text-primary">{avgMileage}</p>
            <p className="text-[9px] text-muted font-medium">Avg km/L</p>
          </div>
        </div>
      </div>

      {/* Vehicle Cards - Horizontal Scroll */}
      <div className="px-5 mb-2 flex items-center justify-between">
        <h2 className="text-caps text-muted">Your Fleet</h2>
        <button onClick={() => navigate('/vehicles')} className="text-xs text-accent font-semibold flex items-center gap-0.5">
          View All <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="px-5 mb-6 overflow-x-auto hide-scrollbar">
        <div className="flex gap-3" style={{ minWidth: 'min-content' }}>
          {loading ? (
            <>
              <SkeletonVehicleCard />
              <SkeletonVehicleCard />
            </>
          ) : (
            <>
              {vehicles.map(v => (
                <button
                  key={v.id}
                  onClick={() => navigate(`/vehicle/${v.id}`)}
                  className="min-w-[270px] bg-dark-card rounded-2xl border border-dark-border p-4 text-left active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        {v.type === 'bike' ? <Bike className="w-5 h-5 text-accent" /> : <Car className="w-5 h-5 text-accent" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-primary">{v.nickname}</h3>
                        <p className="text-[11px] text-muted">{v.make} / {v.model}</p>
                      </div>
                    </div>
                    <HealthRing percent={v.health || 75} size={42} strokeWidth={3} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-caps text-muted mb-0.5">Odometer</p>
                      <p className="text-lg font-bold text-primary">{Number(v.current_odometer).toLocaleString()} km</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted" />
                  </div>
                  <p className="text-[10px] text-muted mt-1">
                    {v.health >= 75 ? 'Last updated 2h ago' : 'Service required soon'}
                  </p>
                </button>
              ))}
              {/* Add Vehicle Card */}
              <button
                onClick={() => navigate('/add-vehicle')}
                className="min-w-[160px] bg-dark-card/50 rounded-2xl border-2 border-dashed border-dark-border p-4 flex flex-col items-center justify-center gap-2 text-muted hover:border-accent/30 hover:text-accent transition-colors active:scale-[0.98]"
              >
                <div className="w-12 h-12 rounded-full bg-dark-border/30 flex items-center justify-center">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold">Add Vehicle</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Critical Reminders */}
      {activeReminders.length > 0 && (
        <>
          <div className="px-5 mb-2">
            <h2 className="text-caps text-muted">Critical Reminders</h2>
          </div>
          <div className="px-5 mb-6 space-y-2">
            {activeReminders.map(r => (
              <div
                key={r.id}
                className={`rounded-2xl border p-3 flex items-center gap-3 ${
                  r.urgency === 'overdue'
                    ? 'bg-danger/10 border-danger/20'
                    : 'bg-accent/10 border-accent/20'
                }`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  r.urgency === 'overdue' ? 'bg-danger/20' : 'bg-accent/20'
                }`}>
                  {r.type === 'insurance' || r.type === 'puc' ? (
                    <AlertTriangle className={`w-4 h-4 ${r.urgency === 'overdue' ? 'text-danger' : 'text-accent'}`} />
                  ) : (
                    <Wrench className={`w-4 h-4 ${r.urgency === 'overdue' ? 'text-danger' : 'text-accent'}`} />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-primary">{r.title}</h4>
                  <p className="text-[11px] text-muted">
                    {r.due_date ? `Due in ${Math.max(0, Math.ceil((new Date(r.due_date) - new Date()) / 86400000))} days • ${format(new Date(r.due_date), 'MMM dd')}` : ''}
                    {r.due_km ? `Overdue by ${Math.max(0, r.due_km - 12450)} km` : ''}
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  r.urgency === 'overdue' ? 'bg-danger/20' : 'bg-accent/20'
                }`}>
                  <ChevronRight className={`w-4 h-4 ${r.urgency === 'overdue' ? 'text-danger' : 'text-accent'}`} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Recent Activity */}
      <div className="px-5 mb-2">
        <h2 className="text-caps text-muted">Recent Activity</h2>
      </div>
      <div className="px-5 space-y-2 pb-4">
        {(recentActivity.length > 0 ? recentActivity : []).slice(0, 5).map(a => {
          const Icon = activityIcons[a.type] || Sparkles
          return (
            <div key={a.id} className="bg-dark-card rounded-2xl border border-dark-border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-semibold text-primary">
                    {a.type === 'fuel' ? 'Fueling' : a.type === 'trip' ? `Trip: ${a.tripName || 'Trip'}` : a.serviceName || 'Service'}
                  </h4>
                </div>
                <p className="text-[11px] text-muted">
                  {a.vehicle} • {format(new Date(a.date), 'MMM dd')}
                </p>
              </div>
              <span className={`text-sm font-bold ${a.detail.startsWith('-') ? 'text-danger' : 'text-primary'}`}>
                {a.detail}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
