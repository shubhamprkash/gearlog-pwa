import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import FormInput, { FormTextarea, FormToggleGroup } from '../components/FormInput'
import {
  ArrowLeft, Car, Bike, Calendar, Gauge, Fuel, DollarSign,
  Save, ChevronDown, Droplets
} from 'lucide-react'
import { format } from 'date-fns'

export default function AddFuelScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { vehicles, addFuelLog, getVehicleFuelLogs } = useData()

  const preselectedVehicleId = location.state?.vehicleId || (vehicles.length === 1 ? vehicles[0].id : '')
  const [vehicleId, setVehicleId] = useState(preselectedVehicleId)
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [odometer, setOdometer] = useState('')
  const [litres, setLitres] = useState('')
  const [totalCost, setTotalCost] = useState('')
  const [fullTank, setFullTank] = useState(true)
  const [stationName, setStationName] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const vehicle = vehicles.find(v => v.id === vehicleId)
  const prevLogs = useMemo(() => vehicleId ? getVehicleFuelLogs(vehicleId) : [], [vehicleId])

  const costPerLitre = litres && totalCost ? (Number(totalCost) / Number(litres)).toFixed(2) : null
  const mileageCalc = useMemo(() => {
    if (!odometer || !litres || prevLogs.length === 0) return null
    const lastLog = prevLogs[0]
    if (!lastLog) return null
    const dist = Number(odometer) - Number(lastLog.odometer)
    if (dist <= 0) return null
    return (dist / Number(litres)).toFixed(1)
  }, [odometer, litres, prevLogs])

  const handleSave = async () => {
    if (!vehicleId || !date || !odometer || !litres || !totalCost) return
    setSaving(true)
    try {
      await addFuelLog({
        vehicle_id: vehicleId,
        date,
        odometer: Number(odometer),
        litres: Number(litres),
        total_cost: Number(totalCost),
        full_tank: fullTank,
        station_name: stationName || null,
        mileage: mileageCalc ? Number(mileageCalc) : null,
        notes: notes || null,
      })
      navigate(-1)
    } catch (e) {
      alert('Failed to save: ' + e.message)
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-dark-bg flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-dark-border bg-dark-bg z-10">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-primary" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-primary">Add Fuel Log</h1>
            <p className="text-xs text-muted">Record your fuel fill-up</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-5 py-5 space-y-4">
          {/* Vehicle Selector */}
          {!preselectedVehicleId && (
            <div className="space-y-1.5">
              <label className="text-caps text-muted">Active Vehicle</label>
              <div className="relative">
                <select
                  value={vehicleId}
                  onChange={e => setVehicleId(e.target.value)}
                  className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-primary text-sm appearance-none focus:outline-none focus:border-accent/50"
                >
                  <option value="">Select vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.nickname} — {v.make} {v.model}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
            </div>
          )}

          {vehicle && (
            <div className="bg-dark-card rounded-2xl border border-dark-border p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                {vehicle.type === 'bike' ? <Bike className="w-5 h-5 text-accent" /> : <Car className="w-5 h-5 text-accent" />}
              </div>
              <div>
                <p className="text-sm font-bold text-primary">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                <p className="text-[10px] text-muted">{vehicle.nickname} • {vehicle.fuel_type?.toUpperCase()}</p>
              </div>
            </div>
          )}

          <FormInput label="Date" value={date} onChange={setDate} type="date" icon={Calendar} />
          <FormInput label="Odometer" value={odometer} onChange={setOdometer} type="number" placeholder="Current reading" suffix="KM" icon={Gauge} />
          <FormInput label="Fuel Amount" value={litres} onChange={setLitres} type="number" placeholder="Litres filled" suffix="L" icon={Fuel} />
          <FormInput label="Total Cost" value={totalCost} onChange={setTotalCost} type="number" placeholder="Amount paid" suffix="₹" icon={DollarSign} />

          {costPerLitre && (
            <p className="text-xs text-muted">Cost per litre: <span className="text-accent font-semibold">₹{costPerLitre}/L</span></p>
          )}

          {/* Full Tank Toggle */}
          <div className="flex items-center justify-between bg-dark-card rounded-xl border border-dark-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Fuel className="w-4 h-4 text-accent" />
              <span className="text-sm text-primary">Full tank fill?</span>
            </div>
            <button
              type="button"
              onClick={() => setFullTank(!fullTank)}
              className={`toggle-switch ${fullTank ? 'active' : ''}`}
            />
          </div>

          <FormInput label="Station (Optional)" value={stationName} onChange={setStationName} placeholder="Petrol station name" />

          {/* Mileage Preview */}
          {mileageCalc && (
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 text-center">
              <p className="text-caps text-muted mb-1">Efficiency Preview</p>
              <p className="text-3xl font-bold text-accent">{mileageCalc}<span className="text-sm font-medium text-muted">km/l</span></p>
              <p className="text-[10px] text-muted mt-1">Based on current entries & previous log</p>
            </div>
          )}

          <FormTextarea label="Notes" value={notes} onChange={setNotes} placeholder="Any notes..." />
        </div>
      </div>

      {/* Save Button (pinned bottom) */}
      <div className="flex-shrink-0 px-5 py-4 border-t border-dark-border bg-dark-bg z-10">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !vehicleId || !odometer || !litres || !totalCost}
          className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-accent/25 active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Log'}
        </button>
      </div>
    </div>
  )
}
