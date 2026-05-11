import React, { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import FormInput, { FormTextarea, FormToggleGroup } from '../components/FormInput'
import {
  ArrowLeft, Calendar, MapPin, Flag, Save, ChevronDown, Navigation
} from 'lucide-react'
import { format } from 'date-fns'

export default function AddTripScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { vehicles, addTrip } = useData()

  const preselectedVehicleId = location.state?.vehicleId || (vehicles.length === 1 ? vehicles[0].id : '')
  const [vehicleId, setVehicleId] = useState(preselectedVehicleId)
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [fromLocation, setFromLocation] = useState('')
  const [toLocation, setToLocation] = useState('')
  const [startKm, setStartKm] = useState('')
  const [endKm, setEndKm] = useState('')
  const [purpose, setPurpose] = useState('personal')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const distance = useMemo(() => {
    if (!startKm || !endKm) return null
    const d = Number(endKm) - Number(startKm)
    return d > 0 ? d : null
  }, [startKm, endKm])

  const handleSave = async () => {
    if (!vehicleId || !date || !startKm || !endKm) return
    setSaving(true)
    try {
      await addTrip({
        vehicle_id: vehicleId,
        date,
        from_location: fromLocation || null,
        to_location: toLocation || null,
        start_km: Number(startKm),
        end_km: Number(endKm),
        purpose,
        notes: notes || null,
      })
      navigate(-1)
    } catch (e) {
      alert('Failed to save: ' + e.message)
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <div className="px-5 pt-5 pb-3 border-b border-dark-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-primary" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-primary">Add Trip</h1>
            <p className="text-xs text-muted">Log your journey</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {!preselectedVehicleId && (
          <div className="space-y-1.5">
            <label className="text-caps text-muted">Vehicle</label>
            <div className="relative">
              <select
                value={vehicleId}
                onChange={e => setVehicleId(e.target.value)}
                className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-primary text-sm appearance-none focus:outline-none focus:border-accent/50"
              >
                <option value="">Select vehicle</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.nickname}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            </div>
          </div>
        )}

        <FormInput label="Date" value={date} onChange={setDate} type="date" icon={Calendar} />
        <FormInput label="From Location" value={fromLocation} onChange={setFromLocation} placeholder="Starting point" icon={MapPin} />
        <FormInput label="To Location" value={toLocation} onChange={setToLocation} placeholder="Destination" icon={Flag} />

        <div className="grid grid-cols-2 gap-3">
          <FormInput label="Start KM" value={startKm} onChange={setStartKm} type="number" placeholder="Start reading" />
          <FormInput label="End KM" value={endKm} onChange={setEndKm} type="number" placeholder="End reading" />
        </div>

        {/* Distance preview */}
        {distance && (
          <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 text-center">
            <p className="text-caps text-muted mb-1">Estimated Distance</p>
            <p className="text-3xl font-bold text-accent">{distance.toFixed(1)}<span className="text-sm font-medium text-muted">KM</span></p>
          </div>
        )}

        <FormToggleGroup label="Trip Purpose" value={purpose} onChange={setPurpose} options={[
          { value: 'personal', label: 'Personal' },
          { value: 'work', label: 'Work' },
          { value: 'travel', label: 'Travel' },
        ]} />

        <FormTextarea label="Trip Notes" value={notes} onChange={setNotes} placeholder="Any notes..." />

        {/* Route preview placeholder */}
        {fromLocation && toLocation && (
          <div className="bg-dark-card rounded-2xl border border-dark-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">Route Preview Generated</p>
              <p className="text-[10px] text-muted">{fromLocation} → {toLocation}</p>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-dark-border">
        <button
          onClick={handleSave}
          disabled={saving || !vehicleId || !startKm || !endKm}
          className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-accent/25 active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Trip'}
        </button>
      </div>
    </div>
  )
}
