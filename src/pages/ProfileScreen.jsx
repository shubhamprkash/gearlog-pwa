import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useData } from '../contexts/DataContext'
import {
  User, Mail, Car, Bike, Edit, Trash2, LogOut, Bell, Wrench,
  Calendar, Route, ChevronRight, Shield
} from 'lucide-react'

export default function ProfileScreen() {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const { vehicles, deleteVehicle } = useData()
  const [notifyService, setNotifyService] = useState(profile?.notify_service !== false)
  const [notifyExpiry, setNotifyExpiry] = useState(profile?.notify_expiry !== false)
  const [notifyDaily, setNotifyDaily] = useState(profile?.notify_daily_summary || false)
  const [showLogout, setShowLogout] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/', { replace: true })
    } catch (e) {
      alert('Logout failed')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this vehicle? All associated data will be lost.')) {
      await deleteVehicle(id)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-primary">Profile</h1>
      </div>

      {/* User Info */}
      <div className="px-5 mb-6">
        <div className="bg-dark-card rounded-2xl border border-dark-border p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 border-2 border-accent/30 flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-accent" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-primary">{profile?.full_name || 'User'}</h2>
            <p className="text-xs text-muted flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {user?.email || 'demo@gearlog.app'}
            </p>
          </div>
          <button
            onClick={() => navigate('/edit-profile')}
            className="w-9 h-9 rounded-xl bg-dark-bg border border-dark-border flex items-center justify-center active:scale-95 transition-transform"
          >
            <Edit className="w-4 h-4 text-muted" />
          </button>
        </div>
      </div>

      {/* My Vehicles */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-caps text-muted">My Vehicles</h3>
          <span className="text-[10px] text-accent font-semibold bg-accent/10 px-2 py-0.5 rounded-full">
            {vehicles.length} of 4 slots used
          </span>
        </div>
        <div className="space-y-2">
          {vehicles.map(v => (
            <div key={v.id} className="bg-dark-card rounded-2xl border border-dark-border p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                {v.type === 'bike' ? <Bike className="w-5 h-5 text-accent" /> : <Car className="w-5 h-5 text-accent" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-primary truncate">{v.nickname || `${v.year} ${v.make} ${v.model}`}</h4>
                <p className="text-[10px] text-muted capitalize">{v.type} • {v.fuel_type}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/vehicle/${v.id}`)}
                  className="w-8 h-8 rounded-lg bg-dark-bg border border-dark-border flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Edit className="w-3.5 h-3.5 text-muted" />
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="w-8 h-8 rounded-lg bg-danger/10 border border-danger/20 flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Trash2 className="w-3.5 h-3.5 text-danger" />
                </button>
              </div>
            </div>
          ))}
          {vehicles.length < 4 && (
            <button
              onClick={() => navigate('/add-vehicle')}
              className="w-full bg-dark-card/50 rounded-2xl border-2 border-dashed border-dark-border p-3 flex items-center justify-center gap-2 text-muted text-sm font-medium hover:border-accent/30 hover:text-accent transition-colors active:scale-[0.98]"
            >
              + Add Vehicle
            </button>
          )}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="px-5 mb-6">
        <h3 className="text-caps text-muted mb-3">Notification Settings</h3>
        <div className="bg-dark-card rounded-2xl border border-dark-border divide-y divide-dark-border">
          {[
            { icon: Wrench, label: 'Service Reminders', state: notifyService, toggle: setNotifyService },
            { icon: Calendar, label: 'Registration Expiry', state: notifyExpiry, toggle: setNotifyExpiry },
            { icon: Route, label: 'Daily Trip Summary', state: notifyDaily, toggle: setNotifyDaily },
          ].map(n => (
            <div key={n.label} className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-3">
                <n.icon className="w-4 h-4 text-accent" />
                <span className="text-sm text-primary">{n.label}</span>
              </div>
              <button
                onClick={() => n.toggle(!n.state)}
                className={`toggle-switch ${n.state ? 'active' : ''}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* App Info */}
      <div className="px-5 mb-6">
        <div className="bg-dark-card rounded-2xl border border-dark-border p-4 flex items-center justify-between">
          <span className="text-sm text-muted">App Version</span>
          <span className="text-xs text-muted/70">GearLog v2.4.1 (Pro)</span>
        </div>
      </div>

      {/* Logout */}
      <div className="px-5">
        <button
          onClick={() => setShowLogout(true)}
          className="w-full bg-danger/10 border border-danger/20 rounded-2xl py-3.5 flex items-center justify-center gap-2 text-danger font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
        <p className="text-center text-[10px] text-muted/50 mt-4">© 2024 GearSystems Global</p>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-primary mb-2">Logout?</h3>
            <p className="text-sm text-muted mb-6">Are you sure you want to sign out?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 py-3 bg-dark-bg border border-dark-border rounded-xl text-sm font-semibold text-primary active:scale-[0.98] transition-transform"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-danger text-white rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
