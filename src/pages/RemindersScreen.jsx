import React, { useState, useMemo } from 'react'
import { useData } from '../contexts/DataContext'
import EmptyState from '../components/EmptyState'
import {
  Bell, AlertTriangle, CheckCircle, Clock, Wrench, Shield,
  Fuel, Disc, Link2, Battery as BatteryIcon, CircleDot, Check, X
} from 'lucide-react'
import { format } from 'date-fns'

const tabs = ['Active', 'Completed', 'Dismissed']

const typeIcons = {
  oil_change: Wrench,
  service: Wrench,
  insurance: Shield,
  puc: Shield,
  tyre: CircleDot,
  brake: Disc,
  chain: Link2,
  battery: BatteryIcon,
  default: Bell,
}

export default function RemindersScreen() {
  const { reminders, vehicles, updateReminder } = useData()
  const [activeTab, setActiveTab] = useState('Active')

  const filtered = useMemo(() =>
    reminders.filter(r => r.status === activeTab.toLowerCase()),
    [reminders, activeTab]
  )

  // Group by vehicle
  const grouped = useMemo(() => {
    const map = {}
    filtered.forEach(r => {
      const v = vehicles.find(v => v.id === r.vehicle_id)
      const name = v?.nickname || 'Unknown Vehicle'
      if (!map[name]) map[name] = []
      map[name].push(r)
    })
    return map
  }, [filtered, vehicles])

  const markComplete = (id) => updateReminder(id, { status: 'completed' })
  const dismiss = (id) => updateReminder(id, { status: 'dismissed' })

  const urgencyColor = {
    overdue: { bg: 'bg-danger/10', border: 'border-danger/20', text: 'text-danger', dot: 'bg-danger' },
    soon: { bg: 'bg-accent/10', border: 'border-accent/20', text: 'text-accent', dot: 'bg-accent' },
    ok: { bg: 'bg-ok/10', border: 'border-ok/20', text: 'text-ok', dot: 'bg-ok' },
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-primary mb-1">Reminders</h1>
        <p className="text-sm text-muted">Stay on top of maintenance</p>
      </div>

      {/* Maintenance Health Card */}
      <div className="px-5 mb-4">
        <div className="bg-dark-card rounded-2xl border border-dark-border p-4 flex items-center gap-4">
          <div>
            <p className="text-caps text-muted mb-1">Maintenance Health</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-ok">72%</span>
              <span className="text-xs text-muted">Fleet Ready</span>
              <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full font-medium">
                {reminders.filter(r => r.status === 'active').length} Alerts
              </span>
            </div>
          </div>
          <div className="ml-auto flex gap-4">
            <div className="text-center">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center mb-0.5">
                <Wrench className="w-4 h-4 text-accent" />
              </div>
              <span className="text-xs font-bold text-primary">12</span>
              <p className="text-[8px] text-muted">Done</p>
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
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex gap-1 bg-dark-card rounded-xl p-1 border border-dark-border">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
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

      {/* Content */}
      <div className="px-5 space-y-4">
        {Object.keys(grouped).length === 0 ? (
          <EmptyState
            icon={Bell}
            title={`No ${activeTab.toLowerCase()} reminders`}
            message={activeTab === 'Active' ? "You're all caught up!" : `No ${activeTab.toLowerCase()} reminders yet`}
          />
        ) : (
          Object.entries(grouped).map(([vehicleName, items]) => (
            <div key={vehicleName}>
              <h3 className="text-sm font-bold text-primary mb-2">{vehicleName}</h3>
              <div className="space-y-2">
                {items.map(r => {
                  const uc = urgencyColor[r.urgency] || urgencyColor.ok
                  const Icon = typeIcons[r.type] || typeIcons.default

                  return (
                    <div key={r.id} className={`${uc.bg} ${uc.border} border rounded-2xl p-4`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${uc.bg}`}>
                          <Icon className={`w-4 h-4 ${uc.text}`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-primary">{r.title}</h4>
                          <p className="text-[11px] text-muted mt-0.5">
                            {r.due_date && `${format(new Date(r.due_date), 'MMM dd')} • `}
                            {r.due_km && `Due: ${Number(r.due_km).toLocaleString()} KM`}
                            {!r.due_date && !r.due_km && 'No due date set'}
                          </p>
                          <span className={`inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${uc.bg} ${uc.text}`}>
                            {r.urgency}
                          </span>
                        </div>
                      </div>
                      {activeTab === 'Active' && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => markComplete(r.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-ok/10 border border-ok/20 rounded-xl text-[11px] font-semibold text-ok active:scale-95 transition-transform"
                          >
                            <Check className="w-3.5 h-3.5" /> Mark Complete
                          </button>
                          <button
                            onClick={() => dismiss(r.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-dark-card border border-dark-border rounded-xl text-[11px] font-semibold text-muted active:scale-95 transition-transform"
                          >
                            <X className="w-3.5 h-3.5" /> Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
