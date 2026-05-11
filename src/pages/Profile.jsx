import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { Card, ScrollPage } from '../components/UI'
import { User, Mail, Car, Bike, Edit, Trash2, LogOut, Wrench, Calendar, Route, Plus } from 'lucide-react'

export default function Profile() {
  const nav = useNavigate()
  const { user, profile, signOut, vehicles, deleteVehicle, setActiveVehicleId } = useStore()
  const [showLogout, setShowLogout] = useState(false)

  const handleLogout = async () => { try { await signOut(); nav('/', { replace: true }) } catch(e) { alert('Logout failed') } }

  return (
    <ScrollPage>
      <div className="px-5 pt-6 pb-4"><h1 className="text-xl font-bold text-[#f1f5f9]">Profile</h1></div>

      <div className="px-5 mb-6">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#f97316]/10 border-2 border-[#f97316]/30 flex items-center justify-center"><User className="w-7 h-7 text-[#f97316]" /></div>
          <div className="flex-1"><h2 className="text-base font-bold text-[#f1f5f9]">{profile?.full_name || 'User'}</h2><p className="text-[10px] text-[#64748b] flex items-center gap-1"><Mail className="w-3 h-3"/>{user?.email||'demo@gearlog.app'}</p></div>
        </Card>
      </div>

      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-caps text-[#64748b]">MY VEHICLES</p>
          <span className="text-[9px] text-[#f97316] font-semibold bg-[#f97316]/10 px-2 py-0.5 rounded-full">{vehicles.length}/4</span>
        </div>
        <div className="space-y-2">
          {vehicles.map(v => (
            <Card key={v.id} className="p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#f97316]/10 flex items-center justify-center">
                {v.type === 'bike' || v.type === 'scooter' ? <Bike className="w-4 h-4 text-[#f97316]"/> : <Car className="w-4 h-4 text-[#f97316]"/>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#f1f5f9] truncate">{v.nickname}</p>
                <p className="text-[9px] text-[#64748b]">{v.make} {v.model} • {Number(v.current_odometer||0).toLocaleString()} km</p>
              </div>
              <button onClick={()=>{setActiveVehicleId(v.id);nav('/dashboard')}} className="w-7 h-7 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center justify-center active:scale-90 transition"><Edit className="w-3 h-3 text-[#64748b]"/></button>
              <button onClick={()=>{if(confirm('Delete '+v.nickname+'?'))deleteVehicle(v.id)}} className="w-7 h-7 rounded-lg bg-[#ef4444]/10 border border-[#ef4444]/20 flex items-center justify-center active:scale-90 transition"><Trash2 className="w-3 h-3 text-[#ef4444]"/></button>
            </Card>
          ))}
          {vehicles.length < 4 && (
            <button onClick={()=>nav('/add-vehicle')} className="w-full bg-[#1e293b]/50 rounded-2xl border-2 border-dashed border-[#334155] p-3 flex items-center justify-center gap-2 text-[#64748b] text-sm font-medium active:scale-[0.98] transition">
              <Plus className="w-4 h-4"/> Add Vehicle
            </button>
          )}
        </div>
      </div>

      <div className="px-5 mb-6">
        <Card className="p-4 flex items-center justify-between"><span className="text-sm text-[#64748b]">Version</span><span className="text-xs text-[#64748b]/60">GearLog v3.0</span></Card>
      </div>

      <div className="px-5">
        <button onClick={()=>setShowLogout(true)} className="w-full bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-2xl py-3.5 flex items-center justify-center gap-2 text-[#ef4444] font-semibold text-sm active:scale-[0.97] transition"><LogOut className="w-4 h-4"/>Logout</button>
      </div>

      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <Card className="p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-[#f1f5f9] mb-2">Logout?</h3>
            <p className="text-sm text-[#64748b] mb-6">Are you sure you want to sign out?</p>
            <div className="flex gap-3">
              <button onClick={()=>setShowLogout(false)} className="flex-1 py-3 bg-[#0f172a] border border-[#334155] rounded-xl text-sm font-semibold text-[#f1f5f9]">Cancel</button>
              <button onClick={handleLogout} className="flex-1 py-3 bg-[#ef4444] text-white rounded-xl text-sm font-semibold">Logout</button>
            </div>
          </Card>
        </div>
      )}
    </ScrollPage>
  )
}
