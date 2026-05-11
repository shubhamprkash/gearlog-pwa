import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import FormInput, { FormTextarea, FormChipSelect } from '../components/FormInput'
import {
  ArrowLeft, Calendar, Gauge, Wrench, Save, ChevronDown, DollarSign
} from 'lucide-react'
import { format } from 'date-fns'

const serviceTypes = [
  { value: 'oil_change', label: 'Oil Change' },
  { value: 'general', label: 'General Service' },
  { value: 'major', label: 'Major Service' },
  { value: 'repair', label: 'Repair' },
]

const partsOptions = [
  'Oil Filter', 'Air Filter', 'Brake Pads', 'Spark Plugs',
  'Chain Set', 'Tyres', 'Battery', 'Clutch Plates', 'Cabin Filter', 'Brake Fluid'
]

export default function AddServiceScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { vehicles, addServiceLog } = useData()

  const preselectedVehicleId = location.state?.vehicleId || (vehicles.length === 1 ? vehicles[0].id : '')
  const [vehicleId, setVehicleId] = useState(preselectedVehicleId)
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [odometer, setOdometer] = useState('')
  const [serviceType, setServiceType] = useState('general')
  const [partsChanged, setPartsChanged] = useState([])
  const [oilBrand, setOilBrand] = useState('')
  const [oilGrade, setOilGrade] = useState('')
  const [totalCost, setTotalCost] = useState('')
  const [workshopName, setWorkshopName] = useState('')
  const [nextServiceDate, setNextServiceDate] = useState('')
  const [nextServiceKm, setNextServiceKm] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!vehicleId || !date || !odometer) return
    setSaving(true)
    try {
      await addServiceLog({
        vehicle_id: vehicleId,
        date,
        odometer: Number(odometer),
        service_type: serviceType,
        parts_changed: partsChanged.length > 0 ? partsChanged : null,
        oil_brand: oilBrand || null,
        oil_grade: oilGrade || null,
        total_cost: totalCost ? Number(totalCost) : null,
        workshop_name: workshopName || null,
        next_service_date: nextServiceDate || null,
        next_service_km: nextServiceKm ? Number(nextServiceKm) : null,
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
            <p className="text-caps text-muted">Maintenance Record</p>
            <h1 className="text-lg font-bold text-primary">Add Service Log</h1>
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

        <FormInput label="Service Date" value={date} onChange={setDate} type="date" icon={Calendar} />
        <FormInput label="Current Odometer (KM)" value={odometer} onChange={setOdometer} type="number" suffix="KM" icon={Gauge} />

        {/* Service Type */}
        <div className="space-y-1.5">
          <label className="text-caps text-muted">Service Type</label>
          <div className="flex gap-1 bg-dark-bg rounded-xl p-1 border border-dark-border flex-wrap">
            {serviceTypes.map(st => (
              <button
                key={st.value}
                type="button"
                onClick={() => setServiceType(st.value)}
                className={`flex-1 py-2 px-2 rounded-lg text-[10px] font-semibold transition-all min-w-fit ${
                  serviceType === st.value
                    ? 'bg-accent text-white shadow-md'
                    : 'text-muted hover:text-primary'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Oil brand & grade (only if oil change) */}
        {serviceType === 'oil_change' && (
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Oil Brand" value={oilBrand} onChange={setOilBrand} placeholder="e.g. Motul" />
            <FormInput label="Oil Grade" value={oilGrade} onChange={setOilGrade} placeholder="e.g. 10W-40" />
          </div>
        )}

        <FormChipSelect label="Parts Changed" options={partsOptions} selected={partsChanged} onChange={setPartsChanged} />

        <FormInput label="Workshop / Service Center" value={workshopName} onChange={setWorkshopName} placeholder="Workshop name" icon={Wrench} />
        <FormInput label="Total Cost ($)" value={totalCost} onChange={setTotalCost} type="number" placeholder="Amount" icon={DollarSign} />

        <div className="bg-dark-card rounded-2xl border border-dark-border p-4 space-y-3">
          <h4 className="text-caps text-muted">Next Recommended Service</h4>
          <div className="grid grid-cols-2 gap-3">
            <FormInput label="Due Date" value={nextServiceDate} onChange={setNextServiceDate} type="date" />
            <FormInput label="Due KM" value={nextServiceKm} onChange={setNextServiceKm} type="number" suffix="KM" />
          </div>
        </div>

        <FormTextarea label="Service Notes" value={notes} onChange={setNotes} placeholder="Any notes about this service..." />
      </div>

      <div className="px-5 py-4 border-t border-dark-border">
        <button
          onClick={handleSave}
          disabled={saving || !vehicleId || !odometer}
          className="w-full flex items-center justify-center gap-2 bg-accent text-white py-3.5 rounded-2xl font-semibold text-sm shadow-lg shadow-accent/25 active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Service'}
        </button>
      </div>
    </div>
  )
}
