import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { PageShell, Input, Card } from '../components/UI'
import { ArrowLeft, Save, Gauge, Fuel, IndianRupee, Calendar } from 'lucide-react'
import { format } from 'date-fns'

export default function AddFuel() {
  const nav = useNavigate()
  const { activeVehicle, activeVehicleId, addFuelLog, updateVehicle, vFuel } = useStore()
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [odo, setOdo] = useState('')
  const [litres, setLitres] = useState('')
  const [cost, setCost] = useState('')
  const [fullTank, setFullTank] = useState(true)
  const [station, setStation] = useState('')
  const [saving, setSaving] = useState(false)

  const costPerL = litres && cost ? (Number(cost) / Number(litres)).toFixed(1) : null

  // Smart mileage from last fill-up
  const smartMileage = useMemo(() => {
    if (!odo || !litres) return null
    const sorted = [...vFuel].filter(f => f.full_tank).sort((a, b) => b.odometer - a.odometer)
    const last = sorted[0]
    if (!last) return null
    const dist = Number(odo) - last.odometer
    if (dist <= 0) return null
    return (dist / Number(litres)).toFixed(1)
  }, [odo, litres, vFuel])

  const save = async () => {
    if (!odo || !litres || !cost) return
    setSaving(true)
    try {
      await addFuelLog({ vehicle_id: activeVehicleId, date, odometer: Number(odo), litres: Number(litres), total_cost: Number(cost), full_tank: fullTank, station_name: station || null })
      // Auto-update vehicle odometer if higher
      if (Number(odo) > (activeVehicle?.current_odometer || 0)) {
        await updateVehicle(activeVehicleId, { current_odometer: Number(odo) })
      }
      nav(-1)
    } catch (e) { alert(e.message) }
    setSaving(false)
  }

  return (
    <PageShell
      header={<div className="px-5 pt-5 pb-3 border-b border-[#334155] bg-[#0f172a]"><div className="flex items-center gap-3"><button type="button" onClick={() => nav(-1)} className="w-9 h-9 rounded-xl bg-[#1e293b] border border-[#334155] flex items-center justify-center"><ArrowLeft className="w-4 h-4 text-[#f1f5f9]" /></button><div><h1 className="text-base font-bold text-[#f1f5f9]">Add Fuel Log</h1><p className="text-[10px] text-[#64748b]">{activeVehicle?.nickname || 'Select vehicle first'}</p></div></div></div>}
      footer={<div className="px-5 py-4 border-t border-[#334155] bg-[#0f172a]"><button type="button" onClick={save} disabled={saving||!odo||!litres||!cost} className="w-full flex items-center justify-center gap-2 bg-[#f97316] text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-[#f97316]/25 active:scale-[0.97] transition disabled:opacity-40"><Save className="w-4 h-4"/>{saving?'Saving...':'Save Log'}</button></div>}
    >
      <div className="px-5 py-5 space-y-4">
        <Input label="DATE" value={date} onChange={e => setDate(e.target.value)} type="date" icon={Calendar} />
        <Input label="ODOMETER READING" value={odo} onChange={e => setOdo(e.target.value)} type="number" placeholder={`Last: ${Number(activeVehicle?.current_odometer||0).toLocaleString()}`} suffix="KM" icon={Gauge} />
        <Input label="LITRES FILLED" value={litres} onChange={e => setLitres(e.target.value)} type="number" placeholder="0.0" suffix="L" icon={Fuel} />
        <Input label="TOTAL COST" value={cost} onChange={e => setCost(e.target.value)} type="number" placeholder="0" suffix="₹" icon={IndianRupee} />
        {costPerL && <p className="text-[11px] text-[#64748b]">Rate: <span className="text-[#f97316] font-semibold">₹{costPerL}/L</span></p>}
        <div className="flex items-center justify-between bg-[#1e293b] rounded-xl border border-[#334155] px-4 py-3">
          <span className="text-sm text-[#f1f5f9]">Full tank fill?</span>
          <button type="button" onClick={() => setFullTank(!fullTank)} className={`toggle ${fullTank ? 'on' : ''}`} />
        </div>
        <Input label="STATION (optional)" value={station} onChange={e => setStation(e.target.value)} placeholder="e.g. HP Petrol Pump" />
        {smartMileage && (
          <Card className="p-4 text-center border-[#f97316]/20 bg-[#f97316]/5">
            <p className="text-caps text-[#64748b] mb-1">CALCULATED MILEAGE</p>
            <p className="text-3xl font-bold text-[#f97316]">{smartMileage} <span className="text-sm font-medium text-[#64748b]">km/L</span></p>
            <p className="text-[9px] text-[#64748b] mt-1">Based on distance since last full-tank fill-up</p>
          </Card>
        )}
      </div>
    </PageShell>
  )
}
