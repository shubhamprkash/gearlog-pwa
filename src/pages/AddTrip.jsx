import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../lib/store'
import { PageShell, Input, Pills, Textarea, Card } from '../components/UI'
import { ArrowLeft, Save, Calendar, MapPin, Flag } from 'lucide-react'
import { format } from 'date-fns'

export default function AddTrip() {
  const nav = useNavigate()
  const location = useLocation()
  const { activeVehicle, activeVehicleId, addTrip, updateTrip, updateVehicle } = useStore()

  const editing = location.state?.edit || null
  const isEdit = !!editing

  const [date, setDate] = useState(editing?.date || format(new Date(),'yyyy-MM-dd'))
  const [from, setFrom] = useState(editing?.from_location || '')
  const [to, setTo] = useState(editing?.to_location || '')
  const [startKm, setStartKm] = useState(editing?.start_km?.toString() || '')
  const [endKm, setEndKm] = useState(editing?.end_km?.toString() || '')
  const [purpose, setPurpose] = useState(editing?.purpose || 'personal')
  const [notes, setNotes] = useState(editing?.notes || '')
  const [saving, setSaving] = useState(false)

  const dist = useMemo(() => { const d = Number(endKm) - Number(startKm); return d > 0 ? d : null }, [startKm, endKm])

  const save = async () => {
    if (!startKm || !endKm) return; setSaving(true)
    try {
      const payload = { vehicle_id: activeVehicleId, date, from_location: from||null, to_location: to||null, start_km: Number(startKm), end_km: Number(endKm), purpose, notes: notes||null }
      if (isEdit) {
        await updateTrip(editing.id, payload)
      } else {
        await addTrip(payload)
      }
      if (Number(endKm) > (activeVehicle?.current_odometer||0)) await updateVehicle(activeVehicleId, { current_odometer: Number(endKm) })
      nav(-1)
    } catch(e) { alert(e.message) }
    setSaving(false)
  }

  return (
    <PageShell
      header={
        <div className="px-5 pt-5 pb-3 border-b border-[#334155] bg-[#0f172a]">
          <div className="flex items-center gap-3">
            <button type="button" onClick={()=>nav(-1)} className="w-9 h-9 rounded-xl bg-[#1e293b] border border-[#334155] flex items-center justify-center"><ArrowLeft className="w-4 h-4 text-[#f1f5f9]"/></button>
            <div>
              <h1 className="text-base font-bold text-[#f1f5f9]">{isEdit ? 'Edit Trip' : 'Add Trip'}</h1>
              <p className="text-[10px] text-[#64748b]">{activeVehicle?.nickname||''}</p>
            </div>
          </div>
        </div>
      }
      footer={
        <div className="px-5 py-4 border-t border-[#334155] bg-[#0f172a]">
          <button type="button" onClick={save} disabled={saving||!startKm||!endKm} className="w-full flex items-center justify-center gap-2 bg-[#f97316] text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-[#f97316]/25 active:scale-[0.97] transition disabled:opacity-40">
            <Save className="w-4 h-4"/>{saving ? 'Saving...' : isEdit ? 'Update Trip' : 'Save Trip'}
          </button>
        </div>
      }
    >
      <div className="px-5 py-5 space-y-4">
        <Input label="DATE" value={date} onChange={e=>setDate(e.target.value)} type="date" icon={Calendar} />
        <Input label="FROM" value={from} onChange={e=>setFrom(e.target.value)} placeholder="Starting point" icon={MapPin} />
        <Input label="TO" value={to} onChange={e=>setTo(e.target.value)} placeholder="Destination" icon={Flag} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="START KM" value={startKm} onChange={e=>setStartKm(e.target.value)} type="number" />
          <Input label="END KM" value={endKm} onChange={e=>setEndKm(e.target.value)} type="number" />
        </div>
        {dist && <Card className="p-4 text-center border-[#f97316]/20 bg-[#f97316]/5"><p className="text-caps text-[#64748b] mb-1">DISTANCE</p><p className="text-3xl font-bold text-[#f97316]">{dist} <span className="text-sm text-[#64748b]">KM</span></p></Card>}
        <Pills label="PURPOSE" options={[{value:'personal',label:'Personal'},{value:'work',label:'Work'},{value:'travel',label:'Travel'}]} value={purpose} onChange={setPurpose} />
        <Textarea label="NOTES" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Trip notes..." />
      </div>
    </PageShell>
  )
}
