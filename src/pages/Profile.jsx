import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { Card, ScrollPage } from '../components/UI'
import {
  User,
  Mail,
  Car,
  Bike,
  Edit,
  Trash2,
  LogOut,
  Plus,
  X,
  Save,
  ExternalLink,
} from 'lucide-react'

export default function Profile() {
  const nav = useNavigate()

  const {
    user,
    profile,
    signOut,
    vehicles,
    deleteVehicle,
    setActiveVehicleId,
    updateProfile,
  } = useStore()

  const [showLogout, setShowLogout] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState('')

  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
    avatar_url: profile?.avatar_url || '',
  })

  const handleLogout = async () => {
    try {
      await signOut()
      nav('/', { replace: true })
    } catch (e) {
      alert('Logout failed')
    }
  }

  const openEditProfile = () => {
    setProfileForm({
      full_name: profile?.full_name || '',
      avatar_url: profile?.avatar_url || '',
    })
    setProfileError('')
    setShowEditProfile(true)
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()

    if (!profileForm.full_name.trim()) {
      setProfileError('Full name is required')
      return
    }

    try {
      setSavingProfile(true)
      setProfileError('')

      await updateProfile({
        full_name: profileForm.full_name.trim(),
        avatar_url: profileForm.avatar_url.trim(),
      })

      setShowEditProfile(false)
    } catch (error) {
      console.error(error)
      setProfileError(error.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <ScrollPage>
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-xl font-bold text-[#f1f5f9]">Profile</h1>
      </div>

      <div className="px-5 mb-6">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#f97316]/10 border-2 border-[#f97316]/30 flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile?.full_name || 'User'}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-7 h-7 text-[#f97316]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-[#f1f5f9] truncate">
              {profile?.full_name || 'User'}
            </h2>

            <p className="text-[10px] text-[#64748b] flex items-center gap-1 truncate">
              <Mail className="w-3 h-3 shrink-0" />
              {user?.email || 'demo@gearlog.app'}
            </p>
          </div>

          <button
            onClick={openEditProfile}
            className="w-9 h-9 rounded-xl bg-[#f97316]/10 border border-[#f97316]/20 flex items-center justify-center active:scale-90 transition"
            aria-label="Edit profile"
          >
            <Edit className="w-4 h-4 text-[#f97316]" />
          </button>
        </Card>
      </div>

      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-caps text-[#64748b]">MY VEHICLES</p>
          <span className="text-[9px] text-[#f97316] font-semibold bg-[#f97316]/10 px-2 py-0.5 rounded-full">
            {vehicles.length}/4
          </span>
        </div>

        <div className="space-y-2">
          {vehicles.map((v) => (
            <Card key={v.id} className="p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f97316]/10 flex items-center justify-center">
                {v.type === 'bike' || v.type === 'scooter' ? (
                  <Bike className="w-4 h-4 text-[#f97316]" />
                ) : (
                  <Car className="w-4 h-4 text-[#f97316]" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#f1f5f9] truncate">
                  {v.nickname}
                </p>
                <p className="text-[9px] text-[#64748b]">
                  {v.make} {v.model} •{' '}
                  {Number(v.current_odometer || 0).toLocaleString()} km
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveVehicleId(v.id)
                  nav('/dashboard')
                }}
                className="w-7 h-7 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center justify-center active:scale-90 transition"
                aria-label="Open vehicle"
              >
                <Edit className="w-3 h-3 text-[#64748b]" />
              </button>

              <button
                onClick={() => {
                  if (confirm('Delete ' + v.nickname + '?')) deleteVehicle(v.id)
                }}
                className="w-7 h-7 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center active:scale-90 transition"
                aria-label="Delete vehicle"
              >
                <Trash2 className="w-3 h-3 text-[#ef4444]" />
              </button>
            </Card>
          ))}

          {vehicles.length < 4 && (
            <button
              onClick={() => nav('/add-vehicle')}
              className="w-full bg-[#1e293b]/50 rounded-2xl border-2 border-dashed border-[#334155] p-3 flex items-center justify-center gap-2 text-[#64748b] text-sm font-medium active:scale-[0.98] transition"
            >
              <Plus className="w-4 h-4" /> Add Vehicle
            </button>
          )}
        </div>
      </div>

      <div className="px-5 mb-6">
        <Card className="p-4 flex items-center justify-between">
          <span className="text-sm text-[#64748b]">Version</span>
          <span className="text-xs text-[#64748b]/60">GearLog v3.0</span>
        </Card>
      </div>

      <div className="px-5 mb-6">
        <Card className="p-4 text-center">
          <p className="text-xs text-[#64748b]">
            © 2026, Shubham Web Studios (SWS)
          </p>

          <a
            href="https://www.linkedin.com/in/shubhamprkash/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center justify-center gap-1 text-xs font-semibold text-[#f97316] hover:text-[#fb923c] transition"
          >
            Shubham Prakash
            <ExternalLink className="w-3 h-3" />
          </a>
        </Card>
      </div>

      <div className="px-5 pb-8">
        <button
          onClick={() => setShowLogout(true)}
          className="w-full bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-2xl py-3.5 flex items-center justify-center gap-2 text-[#ef4444] font-semibold text-sm active:scale-[0.97] transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {showEditProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <Card className="p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#f1f5f9]">
                Edit Profile
              </h3>

              <button
                type="button"
                onClick={() => setShowEditProfile(false)}
                className="w-8 h-8 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center justify-center active:scale-90 transition"
                aria-label="Close edit profile"
              >
                <X className="w-4 h-4 text-[#64748b]" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>

                <input
                  type="text"
                  value={profileForm.full_name}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      full_name: e.target.value,
                    }))
                  }
                  placeholder="Enter your name"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-sm text-[#f1f5f9] placeholder:text-[#475569] outline-none focus:border-[#f97316] transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#64748b] mb-1.5 uppercase tracking-wider">
                  Avatar URL
                </label>

                <input
                  type="url"
                  value={profileForm.avatar_url}
                  onChange={(e) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      avatar_url: e.target.value,
                    }))
                  }
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-[#0f172a] border border-[#334155] rounded-xl px-4 py-3 text-sm text-[#f1f5f9] placeholder:text-[#475569] outline-none focus:border-[#f97316] transition"
                />

                <p className="mt-1.5 text-[10px] text-[#64748b]">
                  Optional. Paste a direct image URL.
                </p>
              </div>

              {profileError && (
                <div className="rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/20 px-4 py-3 text-xs text-[#ef4444]">
                  {profileError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 py-3 bg-[#0f172a] border border-[#334155] rounded-xl text-sm font-semibold text-[#f1f5f9] active:scale-[0.97] transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={savingProfile}
                  className="flex-1 py-3 bg-[#f97316] text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {savingProfile ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <Card className="p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-[#f1f5f9] mb-2">
              Logout?
            </h3>

            <p className="text-sm text-[#64748b] mb-6">
              Are you sure you want to sign out?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 py-3 bg-[#0f172a] border border-[#334155] rounded-xl text-sm font-semibold text-[#f1f5f9]"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-[#ef4444] text-white rounded-xl text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          </Card>
        </div>
      )}
    </ScrollPage>
  )
}