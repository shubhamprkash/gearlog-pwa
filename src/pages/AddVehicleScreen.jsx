import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import FormInput, { FormToggleGroup } from '../components/FormInput'
import {
  ArrowLeft, Car, Bike, ChevronRight, Info, Calendar,
  Gauge, Droplets, Wrench, Shield, Filter, Link2, Disc, CircleDot,
  Battery, Bell, CheckCircle
} from 'lucide-react'
import { addMonths, format } from 'date-fns'

const steps = [
  { num: 1, title: 'Basic Info' },
  { num: 2, title: 'Current State' },
  { num: 3, title: 'Last Oil Change' },
  { num: 4, title: 'Last Service' },
  { num: 5, title: 'Parts Status' },
  { num: 6, title: 'Setup Complete' },
]

export default function AddVehicleScreen() {
  const navigate = useNavigate()
  const { addVehicle, vehicles } = useData()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    nickname: '', type: 'car', make: '', model: '', year: '', purchase_date: '',
    fuel_type: 'petrol', condition: 'new',
    current_odometer: '', estimated_mileage: '',
    last_oil_change_date: '', last_oil_change_km: '', oil_brand: '', oil_grade: '',
    oil_interval_km: '5000', oil_interval_months: '6',
    last_service_date: '', last_service_km: '', last_service_type: 'general',
    service_interval_km: '10000', service_interval_months: '12', workshop_name: '',
    air_filter_km: '', air_filter_date: '', chain_km: '', chain_date: '',
    brake_pads_km: '', tyres_km: '', insurance_expiry: '', puc_expiry: '', battery_date: '',
    remind_before_service_km: '500', remind_before_expiry_days: '30',
  })

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const next = () => setStep(s => Math.min(6, s + 1))
  const back = () => setStep(s => Math.max(1, s - 1))

  const handleSave = async () => {
    setSaving(true)
    try {
      const numFields = ['current_odometer', 'estimated_mileage', 'last_oil_change_km', 'oil_interval_km', 'oil_interval_months', 'last_service_km', 'service_interval_km', 'service_interval_months', 'air_filter_km', 'chain_km', 'brake_pads_km', 'tyres_km', 'remind_before_service_km', 'remind_before_expiry_days']
      const processed = { ...form }
      numFields.forEach(f => { if (processed[f]) processed[f] = Number(processed[f]) })
      // Clean empty strings
      Object.keys(processed).forEach(k => { if (processed[k] === '') processed[k] = null })
      await addVehicle(processed)
      navigate('/home', { replace: true })
    } catch (e) {
      alert('Failed to save: ' + e.message)
    }
    setSaving(false)
  }

  // Calculate next oil change preview
  const nextOilDate = form.last_oil_change_date && form.oil_interval_months
    ? format(addMonths(new Date(form.last_oil_change_date), Number(form.oil_interval_months)), 'MMM dd, yyyy')
    : null
  const nextOilKm = form.last_oil_change_km && form.oil_interval_km
    ? (Number(form.last_oil_change_km) + Number(form.oil_interval_km)).toLocaleString()
    : null

  const progressWidth = (step / 6) * 100

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b border-dark-border">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => step === 1 ? navigate(-1) : back()} className="w-9 h-9 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 text-primary" />
          </button>
          <div className="flex-1">
            <p className="text-caps text-accent">Step {step} of 6</p>
            <h1 className="text-lg font-bold text-primary">{steps[step - 1].title}</h1>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-1 mb-2">
          {steps.map((s) => (
            <div key={s.num} className={`flex-1 h-1 rounded-full transition-all ${
              s.num <= step ? 'bg-accent' : 'bg-dark-border'
            }`} />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        {step === 1 && (
          <div className="space-y-4">
            <FormInput label="Nickname" value={form.nickname} onChange={v => set('nickname', v)} placeholder="e.g. Interceptor 650" />
            <FormToggleGroup label="Vehicle Type" value={form.type} onChange={v => set('type', v)} options={[
              { value: 'car', label: 'Car', icon: '🚗' },
              { value: 'bike', label: 'Bike', icon: '🏍️' },
            ]} />
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Make" value={form.make} onChange={v => set('make', v)} placeholder="Brand" />
              <FormInput label="Model" value={form.model} onChange={v => set('model', v)} placeholder="Model" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Year" value={form.year} onChange={v => set('year', v)} type="number" placeholder="2024" />
              <FormInput label="Purchase Date" value={form.purchase_date} onChange={v => set('purchase_date', v)} type="date" />
            </div>
            <FormToggleGroup label="Fuel Type" value={form.fuel_type} onChange={v => set('fuel_type', v)} options={[
              { value: 'petrol', label: 'Petrol' },
              { value: 'diesel', label: 'Diesel' },
              { value: 'cng', label: 'CNG' },
              { value: 'ev', label: 'EV' },
            ]} />
            <FormToggleGroup label="Condition" value={form.condition} onChange={v => set('condition', v)} options={[
              { value: 'new', label: 'New' },
              { value: 'used', label: 'Used' },
            ]} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-dark-card rounded-2xl border border-dark-border p-6 text-center">
              <Gauge className="w-10 h-10 text-accent mx-auto mb-3" />
              <label className="text-caps text-muted block mb-2">Current Odometer</label>
              <input
                type="number"
                value={form.current_odometer}
                onChange={e => set('current_odometer', e.target.value)}
                placeholder="0"
                className="text-4xl font-bold text-primary text-center bg-transparent w-full outline-none placeholder:text-muted/30"
              />
              <span className="text-sm text-muted font-medium">KM</span>
            </div>
            <FormInput label="Estimated Mileage" value={form.estimated_mileage} onChange={v => set('estimated_mileage', v)} type="number" placeholder="e.g. 28" suffix="km/L" />

            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-accent mb-1">Why accuracy matters?</h4>
                <p className="text-xs text-muted leading-relaxed">
                  Your odometer reading is the heartbeat of GearLog. Accurate data allows our predictive engine to notify you precisely when oil changes, tire rotations, and scheduled maintenance are due, preventing costly mechanical failures.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted mb-2">
              Enter your last oil change details to calculate the next service window.
            </p>
            <FormInput label="Service Date" value={form.last_oil_change_date} onChange={v => set('last_oil_change_date', v)} type="date" icon={Calendar} />
            <FormInput label="Odometer at Change" value={form.last_oil_change_km} onChange={v => set('last_oil_change_km', v)} type="number" placeholder="KM" suffix="KM" icon={Gauge} />
            <FormInput label="Oil Brand" value={form.oil_brand} onChange={v => set('oil_brand', v)} placeholder="e.g. Motul" />
            <FormInput label="Oil Grade" value={form.oil_grade} onChange={v => set('oil_grade', v)} placeholder="e.g. 10W-40" />
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Interval (KM)" value={form.oil_interval_km} onChange={v => set('oil_interval_km', v)} type="number" suffix="KM" />
              <FormInput label="Interval (Months)" value={form.oil_interval_months} onChange={v => set('oil_interval_months', v)} type="number" suffix="MON" />
            </div>

            {(nextOilDate || nextOilKm) && (
              <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Droplets className="w-5 h-5 text-accent" />
                  <h4 className="text-sm font-semibold text-accent">Calculated Service Forecast</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted">Next Oil Change Due</span>
                    <span className="text-sm font-bold text-primary">{nextOilDate}</span>
                  </div>
                  {nextOilKm && (
                    <div className="flex justify-between">
                      <span className="text-xs text-muted">At Odometer</span>
                      <span className="text-sm font-bold text-primary">{nextOilKm} KM</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-muted mb-2">
              Provide details of the most recent service to help GearLog calculate your next maintenance window.
            </p>
            <FormInput label="Service Date" value={form.last_service_date} onChange={v => set('last_service_date', v)} type="date" icon={Calendar} />
            <FormInput label="Odometer (KM)" value={form.last_service_km} onChange={v => set('last_service_km', v)} type="number" suffix="KM" icon={Gauge} />
            <FormToggleGroup label="Service Type" value={form.last_service_type} onChange={v => set('last_service_type', v)} options={[
              { value: 'general', label: 'General' },
              { value: 'major', label: 'Major' },
            ]} />
            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Standard Interval (KM)" value={form.service_interval_km} onChange={v => set('service_interval_km', v)} type="number" suffix="KM" />
              <FormInput label="Timeframe" value={form.service_interval_months} onChange={v => set('service_interval_months', v)} type="number" suffix="MON" />
            </div>
            <FormInput label="Service Provider / Workshop" value={form.workshop_name} onChange={v => set('workshop_name', v)} placeholder="Workshop name" icon={Wrench} />
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <p className="text-sm text-muted mb-2">
              Add your current part levels to enable precision maintenance forecasting.
            </p>

            <div className="bg-dark-card rounded-2xl border border-dark-border p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Filter className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-primary">Air Filter</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="KM Run" value={form.air_filter_km} onChange={v => set('air_filter_km', v)} type="number" />
                <FormInput label="Date Installed" value={form.air_filter_date} onChange={v => set('air_filter_date', v)} type="date" />
              </div>
            </div>

            {form.type === 'bike' && (
              <div className="bg-dark-card rounded-2xl border border-dark-border p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Link2 className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-primary">Chain & Sprockets</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FormInput label="KM Run" value={form.chain_km} onChange={v => set('chain_km', v)} type="number" />
                  <FormInput label="Last Lube" value={form.chain_date} onChange={v => set('chain_date', v)} type="date" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <FormInput label="Brake Pads KM" value={form.brake_pads_km} onChange={v => set('brake_pads_km', v)} type="number" />
              <FormInput label="Tyres KM" value={form.tyres_km} onChange={v => set('tyres_km', v)} type="number" />
            </div>

            <div className="bg-dark-card rounded-2xl border border-dark-border p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-primary">Compliance & Electrical</span>
              </div>
              <FormInput label="Insurance Expiry" value={form.insurance_expiry} onChange={v => set('insurance_expiry', v)} type="date" />
              <FormInput label="PUC Expiry" value={form.puc_expiry} onChange={v => set('puc_expiry', v)} type="date" />
              <FormInput label="Battery Install Date" value={form.battery_date} onChange={v => set('battery_date', v)} type="date" />
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <p className="text-sm text-muted mb-2">
              Configure how far in advance you want to be notified of upcoming maintenance and document renewals.
            </p>
            <FormInput label="Remind before service (KM)" value={form.remind_before_service_km} onChange={v => set('remind_before_service_km', v)} type="number" suffix="KM" />
            <FormInput label="Remind before expiry (Days)" value={form.remind_before_expiry_days} onChange={v => set('remind_before_expiry_days', v)} type="number" suffix="Days" />

            <div className="bg-dark-card rounded-2xl border border-dark-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4 text-accent" />
                <h4 className="text-sm font-semibold text-primary">Active Reminders Preview</h4>
              </div>
              <div className="space-y-2">
                {form.oil_interval_km && (
                  <div className="flex items-center justify-between py-2 border-b border-dark-border">
                    <span className="text-xs text-primary">Oil change</span>
                    <span className="text-xs text-accent font-semibold">In {form.remind_before_service_km || 500} km</span>
                  </div>
                )}
                {form.insurance_expiry && (
                  <div className="flex items-center justify-between py-2 border-b border-dark-border">
                    <span className="text-xs text-primary">Insurance renewal</span>
                    <span className="text-xs text-accent font-semibold">In {form.remind_before_expiry_days || 30} days</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs text-primary">Tire rotation</span>
                  <span className="text-xs text-accent font-semibold">In 5,000 km</span>
                </div>
              </div>
            </div>

            {/* System Ready */}
            <div className="bg-ok/10 border border-ok/20 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-ok" />
              <div>
                <h4 className="text-sm font-semibold text-ok">System Ready</h4>
                <p className="text-xs text-muted">Telemetry sync active</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="px-5 py-4 border-t border-dark-border bg-dark-bg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-muted flex items-center gap-1">
            📦 {vehicles.length} of 4 vehicle slots used
          </span>
        </div>
        <div className="flex gap-3">
          {step > 1 && (
            <button onClick={back} className="flex-1 py-3 bg-dark-card border border-dark-border rounded-2xl text-sm font-semibold text-primary active:scale-[0.98] transition-transform">
              Back
            </button>
          )}
          {step === 5 && (
            <button onClick={next} className="py-3 px-6 bg-dark-card border border-dark-border rounded-2xl text-sm font-semibold text-muted active:scale-[0.98] transition-transform">
              Skip Step
            </button>
          )}
          {step < 6 ? (
            <button onClick={next} className="flex-1 flex items-center justify-center gap-1 py-3 bg-accent text-white rounded-2xl text-sm font-semibold shadow-md shadow-accent/25 active:scale-[0.98] transition-transform">
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent text-white rounded-2xl text-sm font-semibold shadow-md shadow-accent/25 active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              {saving ? 'Saving...' : 'Complete Setup'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
