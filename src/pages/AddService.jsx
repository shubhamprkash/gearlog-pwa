import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { PageShell, Input, Pills, ChipSelect, Textarea } from '../components/UI'
import { ArrowLeft, Save, Calendar, Gauge, Wrench, IndianRupee } from 'lucide-react'
import { format } from 'date-fns'

const TYPES = [{value:'oil_change',label:'Oil Change'},{value:'general',label:'General'},{value:'major',label:'Major'},{value:'repair',label:'Repair'}]
const PARTS = ['Engine Oil','Oil Filter','Air Filter','Spark Plug','Brake Pads','Chain Set','Tyres','Battery','Clutch','Coolant','Brake Fluid']

export default function AddService() {
  const nav = useNavigate()
  const { activeVehicle, activeVehicleId, addServiceLog, updateVehicle } = useStore()
  const [date, setDate] = useState(format(new Date(),'yyyy-MM-dd'))
  const [odo, setOdo] = useState('')
  const [type, setType] = useState('general')
  const [parts, setParts] = useState([])
  const [oilBrand, setOilBrand] = useState('')
  const [oilGrade, setOilGrade] = useState('')
  const [cost, setCost] = useState('')
  const [workshop, setWorkshop] = useState(activeVehicle?.workshop_name || '')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!odo) return; setSaving(true)
    try {
      await addServiceLog({ vehicle_id: activeVehicleId, date, odometer: Number(odo), service_type: type, parts_changed: parts.length ? parts : null, oil_brand: oilBrand||null, oil_grade: oilGrade||null, total_cost: cost?Number(cost):null, workshop_name: workshop||null, notes: notes||null })
      // Smart update vehicle records
      const updates = { current_odometer: Math.max(Number(odo), activeVehicle?.current_odometer||0) }
      if (type === 'oil_change' || parts.includes('Engine Oil')) { updates.last_oil_change_km = Number(odo); updates.last_oil_change_date = date; if(oilBrand) updates.oil_brand = oilBrand; if(oilGrade) updates.oil_grade = oilGrade }
      updates.last_service_km = Number(odo); updates.last_service_date = date; updates.last_service_type = type
      if (parts.includes('Air Filter')) updates.air_filter_km = Number(odo)
      if (parts.includes('Brake Pads')) updates.brake_pads_km = Number(odo)
      if (parts.includes('Chain Set')) updates.chain_km = Number(odo)
      if (parts.includes('Tyres')) updates.tyres_km = Number(odo)
      if (parts.includes('Battery')) updates.battery_date = date
      if (workshop) updates.workshop_name = workshop
      await updateVehicle(activeVehicleId, updates)
      nav(-1)
    } catch(e) { alert(e.message) }
    setSaving(false)
  }

  return (
    <PageShell
      header={<div className="px-5 pt-5 pb-3 border-b border-[#334155] bg-[#0f172a]"><div className="flex items-center gap-3"><button type="button" onClick={()=>nav(-1)} className="w-9 h-9 rounded-xl bg-[#1e293b] border border-[#334155] flex items-center justify-center"><ArrowLeft className="w-4 h-4 text-[#f1f5f9]"/></button><div><h1 className="text-base font-bold text-[#f1f5f9]">Add Service Log</h1><p className="text-[10px] text-[#64748b]">{activeVehicle?.nickname||''}</p></div></div></div>}
      footer={<div className="px-5 py-4 border-t border-[#334155] bg-[#0f172a]"><button type="button" onClick={save} disabled={saving||!odo} className="w-full flex items-center justify-center gap-2 bg-[#f97316] text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-[#f97316]/25 active:scale-[0.97] transition disabled:opacity-40"><Save className="w-4 h-4"/>{saving?'Saving...':'Save Service'}</button></div>}
    >
      <div className="px-5 py-5 space-y-4">
        <Input label="DATE" value={date} onChange={e=>setDate(e.target.value)} type="date" icon={Calendar} />
        <Input label="ODOMETER" value={odo} onChange={e=>setOdo(e.target.value)} type="number" suffix="KM" icon={Gauge} placeholder={`Current: ${Number(activeVehicle?.current_odometer||0).toLocaleString()}`} />
        <Pills label="SERVICE TYPE" options={TYPES} value={type} onChange={setType} />
        {(type === 'oil_change') && <div className="grid grid-cols-2 gap-3"><Input label="OIL BRAND" value={oilBrand} onChange={e=>setOilBrand(e.target.value)} placeholder="Motul"/><Input label="OIL GRADE" value={oilGrade} onChange={e=>setOilGrade(e.target.value)} placeholder="10W-40"/></div>}
        <ChipSelect label="PARTS CHANGED" options={PARTS} selected={parts} onChange={setParts} />
        <Input label="WORKSHOP" value={workshop} onChange={e=>setWorkshop(e.target.value)} placeholder="Service center name" icon={Wrench} />
        <Input label="TOTAL COST" value={cost} onChange={e=>setCost(e.target.value)} type="number" suffix="₹" icon={IndianRupee} />
        <Textarea label="NOTES" value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Any notes..." />
        {parts.length > 0 && (
          <div className="bg-[#22c55e]/5 border border-[#22c55e]/20 rounded-xl p-3">
            <p className="text-[10px] text-[#22c55e] font-semibold">✓ Part trackers will auto-reset: {parts.join(', ')}</p>
          </div>
        )}
      </div>
    </PageShell>
  )
}
