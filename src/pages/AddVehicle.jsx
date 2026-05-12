import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import { PageShell, Input, Pills, Card } from '../components/UI'
import { getServiceSchedule } from '../lib/smartCalc'
import {
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  Gauge,
  Info,
  Wrench,
  Calendar,
} from 'lucide-react'

const STEPS = ['Basic Info', 'Odometer', 'Last Service', 'Done']

export default function AddVehicle() {
  const nav = useNavigate()
  const { addVehicle, vehicles } = useStore()

  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const [f, setF] = useState({
    nickname: '',
    type: 'bike',
    make: '',
    model: '',
    year: '',
    fuel_type: 'petrol',
    condition: 'new',
    current_odometer: '',
    last_oil_change_km: '',
    last_service_km: '',
    last_service_date: '',
    insurance_expiry: '',
    puc_expiry: '',
  })

  const set = (k, v) => {
    setF((p) => ({
      ...p,
      [k]: v,
    }))
  }

  const setVehicleType = (type) => {
    setF((p) => ({
      ...p,
      type,
      fuel_type:
        type === 'ev'
          ? 'ev'
          : p.fuel_type === 'ev'
            ? 'petrol'
            : p.fuel_type,
    }))
  }

  const next = () => {
    document.getElementById('sv-scroll')?.scrollTo(0, 0)
    setStep((s) => Math.min(3, s + 1))
  }

  const back = () => {
    document.getElementById('sv-scroll')?.scrollTo(0, 0)
    setStep((s) => Math.max(0, s - 1))
  }

  const schedule = getServiceSchedule(f.make)

  const save = async () => {
    setSaving(true)

    try {
      const odo = Number(f.current_odometer) || 0

      await addVehicle({
        nickname: f.nickname || `${f.make} ${f.model}`,
        type: f.type,
        make: f.make,
        model: f.model,
        year: f.year ? Number(f.year) : null,
        fuel_type: f.fuel_type,
        condition: f.condition,
        current_odometer: odo,
        last_oil_change_km: f.last_oil_change_km
          ? Number(f.last_oil_change_km)
          : odo,
        last_service_km: f.last_service_km
          ? Number(f.last_service_km)
          : odo,
        last_service_date: f.last_service_date || null,
        air_filter_km: odo,
        brake_pads_km: odo,
        tyres_km: odo,
        chain_km: f.type === 'bike' ? odo : null,
        insurance_expiry: f.insurance_expiry || null,
        puc_expiry: f.puc_expiry || null,
        battery_date: new Date().toISOString().split('T')[0],
        oil_interval_km: schedule.oil,
        service_interval_km: schedule.service,
      })

      nav('/dashboard', { replace: true })
    } catch (e) {
      alert(e.message)
    }

    setSaving(false)
  }

  return (
    <PageShell
      header={
        <div className="px-5 pt-5 pb-3 border-b border-[#334155] bg-[#0f172a]">
          <div className="flex items-center gap-3 mb-3">
            <button
              type="button"
              onClick={() => (step === 0 ? nav(-1) : back())}
              className="w-9 h-9 rounded-xl bg-[#1e293b] border border-[#334155] flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 text-[#f1f5f9]" />
            </button>

            <div className="flex-1">
              <p className="text-[10px] text-[#f97316] font-bold">
                STEP {step + 1} OF 4
              </p>
              <h1 className="text-base font-bold text-[#f1f5f9]">
                {STEPS[step]}
              </h1>
            </div>

            <span className="text-[9px] text-[#64748b] bg-[#1e293b] px-2 py-0.5 rounded border border-[#334155]">
              {vehicles.length}/4
            </span>
          </div>

          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full ${
                  i <= step ? 'bg-[#f97316]' : 'bg-[#334155]'
                }`}
              />
            ))}
          </div>
        </div>
      }
      footer={
        <div className="px-5 py-4 border-t border-[#334155] bg-[#0f172a]">
          <div className="flex gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={back}
                className="flex-1 py-3.5 bg-[#1e293b] border border-[#334155] rounded-2xl text-sm font-semibold text-[#f1f5f9] active:scale-[0.97] transition"
              >
                Back
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={next}
                className="flex-1 flex items-center justify-center gap-1 py-3.5 bg-[#f97316] text-white rounded-2xl text-sm font-semibold shadow-md shadow-[#f97316]/25 active:scale-[0.97] transition"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#f97316] text-white rounded-2xl text-sm font-semibold shadow-md shadow-[#f97316]/25 active:scale-[0.97] transition disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                {saving ? 'Saving...' : 'Add Vehicle'}
              </button>
            )}
          </div>
        </div>
      }
    >
      <div id="sv-scroll" className="px-5 py-5 space-y-4">
        {step === 0 && (
          <>
            <Input
              label="NICKNAME"
              value={f.nickname}
              onChange={(e) => set('nickname', e.target.value)}
              placeholder="e.g. My Bullet"
            />

            <Pills
              label="TYPE"
              options={[
                { value: 'bike', label: '🏍️ Bike' },
                { value: 'car', label: '🚗 Car' },
                { value: 'scooter', label: '🛵 Scooter' },
                { value: 'ev', label: '⚡ EV' },
              ]}
              value={f.type}
              onChange={setVehicleType}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="MAKE"
                value={f.make}
                onChange={(e) => set('make', e.target.value)}
                placeholder="Royal Enfield"
              />

              <Input
                label="MODEL"
                value={f.model}
                onChange={(e) => set('model', e.target.value)}
                placeholder="Interceptor 650"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="YEAR"
                value={f.year}
                onChange={(e) => set('year', e.target.value)}
                type="number"
                placeholder="2024"
              />

              <Pills
                label="FUEL"
                options={[
                  { value: 'petrol', label: 'Petrol' },
                  { value: 'diesel', label: 'Diesel' },
                  { value: 'cng', label: 'CNG' },
                  { value: 'ev', label: 'EV' },
                ]}
                value={f.fuel_type}
                onChange={(v) => set('fuel_type', v)}
              />
            </div>

            {f.type === 'ev' && (
              <Card className="p-3 border-[#22c55e]/20 bg-[#22c55e]/5 flex items-start gap-2">
                <Info className="w-4 h-4 text-[#22c55e] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold text-[#22c55e]">
                    EV Mode Enabled
                  </p>
                  <p className="text-[10px] text-[#64748b]">
                    Fuel type has been automatically set to EV.
                  </p>
                </div>
              </Card>
            )}

            {f.make && (
              <Card className="p-3 border-[#f97316]/20 bg-[#f97316]/5 flex items-start gap-2">
                <Info className="w-4 h-4 text-[#f97316] mt-0.5 flex-shrink-0" />

                <div>
                  <p className="text-[11px] font-semibold text-[#f97316]">
                    Smart Schedule Detected
                  </p>

                  <p className="text-[10px] text-[#64748b]">
                    Oil every {schedule.oil.toLocaleString()} km, Service every{' '}
                    {schedule.service.toLocaleString()} km{' '}
                    {schedule.source === 'preset'
                      ? `(${f.make} preset)`
                      : '(default)'}
                  </p>
                </div>
              </Card>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <Card className="p-6 text-center">
              <Gauge className="w-10 h-10 text-[#f97316] mx-auto mb-3" />

              <label className="text-caps text-[#64748b] block mb-2">
                Current Odometer
              </label>

              <input
                type="number"
                value={f.current_odometer}
                onChange={(e) => set('current_odometer', e.target.value)}
                placeholder="0"
                className="text-4xl font-bold text-[#f1f5f9] text-center bg-transparent w-full outline-none placeholder:text-[#64748b]/30"
              />

              <span className="text-sm text-[#64748b]">KM</span>
            </Card>

            <Card className="p-3 flex items-start gap-2 border-[#f97316]/20 bg-[#f97316]/5">
              <Info className="w-4 h-4 text-[#f97316] mt-0.5 flex-shrink-0" />

              <p className="text-[10px] text-[#64748b]">
                Accurate odometer = accurate mileage calculations, service
                predictions, and part life tracking. Check your speedometer now!
              </p>
            </Card>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-xs text-[#64748b]">
              When was the last oil change & service? We'll predict the next
              ones automatically.
            </p>

            <Input
              label="LAST OIL CHANGE KM"
              value={f.last_oil_change_km}
              onChange={(e) => set('last_oil_change_km', e.target.value)}
              type="number"
              placeholder={`e.g. ${Math.max(
                0,
                (Number(f.current_odometer) || 0) - 2000
              )}`}
              suffix="KM"
              icon={Gauge}
            />

            <Input
              label="LAST SERVICE KM"
              value={f.last_service_km}
              onChange={(e) => set('last_service_km', e.target.value)}
              type="number"
              placeholder={`e.g. ${Math.max(
                0,
                (Number(f.current_odometer) || 0) - 3000
              )}`}
              suffix="KM"
              icon={Wrench}
            />

            <Input
              label="LAST SERVICE DATE"
              value={f.last_service_date}
              onChange={(e) => set('last_service_date', e.target.value)}
              type="date"
              icon={Calendar}
            />

            <div className="border-t border-[#334155] pt-4 mt-2">
              <p className="text-caps text-[#64748b] mb-2">
                DOCUMENTS (optional)
              </p>

              <Input
                label="INSURANCE EXPIRY"
                value={f.insurance_expiry}
                onChange={(e) => set('insurance_expiry', e.target.value)}
                type="date"
              />

              <div className="mt-3">
                <Input
                  label="PUC EXPIRY"
                  value={f.puc_expiry}
                  onChange={(e) => set('puc_expiry', e.target.value)}
                  type="date"
                />
              </div>
            </div>

            {(f.last_oil_change_km || f.last_service_km) && (
              <Card className="p-3 border-[#22c55e]/20 bg-[#22c55e]/5">
                <p className="text-[11px] font-semibold text-[#22c55e] mb-1">
                  📊 Predictions Ready
                </p>

                {f.last_oil_change_km && (
                  <p className="text-[10px] text-[#64748b]">
                    Next oil change: ~
                    {(
                      Number(f.last_oil_change_km) + schedule.oil
                    ).toLocaleString()}{' '}
                    km
                  </p>
                )}

                {f.last_service_km && (
                  <p className="text-[10px] text-[#64748b]">
                    Next service: ~
                    {(
                      Number(f.last_service_km) + schedule.service
                    ).toLocaleString()}{' '}
                    km
                  </p>
                )}
              </Card>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#22c55e]" />
              </div>

              <h2 className="text-lg font-bold text-[#f1f5f9] mb-1">
                Ready to Go!
              </h2>

              <p className="text-xs text-[#64748b]">
                GearLog will now track mileage, predict services, and remind you
                when things are due.
              </p>
            </div>

            <Card className="p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#64748b]">Vehicle</span>
                <span className="text-[#f1f5f9] font-semibold">
                  {f.nickname || `${f.make} ${f.model}`}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-[#64748b]">Type</span>
                <span className="text-[#f1f5f9] font-semibold capitalize">
                  {f.type} • {f.fuel_type}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-[#64748b]">Odometer</span>
                <span className="text-[#f1f5f9] font-semibold">
                  {Number(f.current_odometer || 0).toLocaleString()} km
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-[#64748b]">Oil interval</span>
                <span className="text-[#f97316] font-semibold">
                  {schedule.oil.toLocaleString()} km
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-[#64748b]">Service interval</span>
                <span className="text-[#f97316] font-semibold">
                  {schedule.service.toLocaleString()} km
                </span>
              </div>
            </Card>
          </>
        )}
      </div>
    </PageShell>
  )
}