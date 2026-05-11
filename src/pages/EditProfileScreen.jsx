import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import FormInput from '../components/FormInput'
import {
  ArrowLeft, User, Mail, Camera, Save, Check, AlertTriangle, Lock, Eye, EyeOff
} from 'lucide-react'

export default function EditProfileScreen() {
  const navigate = useNavigate()
  const { user, profile, isDemo, fetchProfile } = useAuth()

  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Password change
  const [showPasswordSection, setShowPasswordSection] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const fileRef = useRef(null)

  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Preview locally
    const reader = new FileReader()
    reader.onload = () => setAvatarPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      setError('Name cannot be empty')
      return
    }

    setError('')
    setSaving(true)
    setSuccess(false)

    if (isDemo) {
      // Demo mode — just simulate save
      await new Promise(r => setTimeout(r, 600))
      setSuccess(true)
      setSaving(false)
      setTimeout(() => navigate(-1), 800)
      return
    }

    try {
      // Update profile in database
      const { error: dbError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (dbError) throw dbError

      // Also update user metadata (for auth display)
      await supabase.auth.updateUser({
        data: { full_name: fullName.trim() }
      })

      // Refresh profile in context
      await fetchProfile(user.id)

      setSuccess(true)
      setTimeout(() => navigate(-1), 800)
    } catch (e) {
      setError(e.message || 'Failed to save profile')
    }

    setSaving(false)
  }

  const handleChangePassword = async () => {
    setPasswordError('')
    setPasswordSuccess(false)

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    if (isDemo) {
      setPasswordError('Password change is not available in demo mode')
      return
    }

    setPasswordSaving(true)

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setPasswordSuccess(true)
      setNewPassword('')
      setConfirmPassword('')
      setShowPasswordSection(false)
    } catch (e) {
      setPasswordError(e.message || 'Failed to update password')
    }

    setPasswordSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-dark-bg flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-dark-border bg-dark-bg z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-primary" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-primary">Edit Profile</h1>
            <p className="text-xs text-muted">Update your personal details</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-5 py-6 space-y-6">

          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-2xl bg-accent/10 border-2 border-accent/30 flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-accent" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/30 active:scale-95 transition-transform"
              >
                <Camera className="w-4 h-4 text-white" />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarPick}
              />
            </div>
            <p className="text-[10px] text-muted">Tap camera to change photo</p>
          </div>

          {/* Success Banner */}
          {success && (
            <div className="bg-ok/10 border border-ok/20 rounded-xl px-4 py-3 flex items-center gap-2">
              <Check className="w-4 h-4 text-ok" />
              <span className="text-sm text-ok font-medium">Profile updated successfully!</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-danger" />
              <span className="text-sm text-danger">{error}</span>
            </div>
          )}

          {/* Name */}
          <FormInput
            label="Full Name"
            value={fullName}
            onChange={setFullName}
            placeholder="Your name"
            icon={User}
          />

          {/* Email (read-only) */}
          <div className="space-y-1.5">
            <label className="text-caps text-muted block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="email"
                value={user?.email || 'demo@gearlog.app'}
                readOnly
                className="w-full bg-dark-input border border-dark-border rounded-xl pl-10 pr-4 py-3 text-muted text-sm cursor-not-allowed opacity-60"
              />
            </div>
            <p className="text-[10px] text-muted">Email cannot be changed</p>
          </div>

          {/* Divider */}
          <div className="border-t border-dark-border" />

          {/* Change Password Section */}
          <div>
            <button
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="flex items-center gap-2 text-sm font-semibold text-accent"
            >
              <Lock className="w-4 h-4" />
              {showPasswordSection ? 'Hide Password Change' : 'Change Password'}
            </button>

            {showPasswordSection && (
              <div className="mt-4 space-y-4 bg-dark-card rounded-2xl border border-dark-border p-4">
                {passwordSuccess && (
                  <div className="bg-ok/10 border border-ok/20 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Check className="w-4 h-4 text-ok" />
                    <span className="text-sm text-ok font-medium">Password changed!</span>
                  </div>
                )}
                {passwordError && (
                  <div className="bg-danger/10 border border-danger/20 rounded-xl px-4 py-3 text-sm text-danger">
                    {passwordError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-caps text-muted">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full bg-dark-bg border border-dark-border rounded-xl pl-10 pr-10 py-3 text-primary text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPass ? <EyeOff className="w-4 h-4 text-muted" /> : <Eye className="w-4 h-4 text-muted" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-caps text-muted">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full bg-dark-bg border border-dark-border rounded-xl pl-10 pr-4 py-3 text-primary text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={passwordSaving || !newPassword || !confirmPassword}
                  className="w-full py-3 bg-accent/10 border border-accent/20 text-accent rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform disabled:opacity-40"
                >
                  {passwordSaving ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="bg-dark-card rounded-2xl border border-dark-border p-4 space-y-2">
            <h4 className="text-caps text-muted mb-1">Account Info</h4>
            <div className="flex justify-between text-xs">
              <span className="text-muted">Account Type</span>
              <span className="text-primary font-medium">{isDemo ? 'Demo' : 'Pro'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted">Member Since</span>
              <span className="text-primary font-medium">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : 'Oct 2024'
                }
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted">User ID</span>
              <span className="text-muted/60 font-mono text-[10px]">{(user?.id || 'demo').slice(0, 12)}…</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button (pinned bottom) */}
      <div className="flex-shrink-0 px-5 py-4 border-t border-dark-border bg-dark-bg z-10">
        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={saving || !fullName.trim()}
          className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-accent/25 active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : success ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  )
}
