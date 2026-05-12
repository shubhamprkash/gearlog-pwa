import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  Shield,
  Droplets,
  Wind,
  Disc,
  CircleDot,
  Link2,
  Battery,
} from 'lucide-react'

const STEPS = ['Basic Info', 'Odometer', 'Service & Parts', 'Review']

export default function AddVehicle() {
  const nav = useNavigate()
  const location = useLocation()

  const { addVehicle, updateVehicle, vehicles } = useStore()

  // Edit mode: pass vehicle via location.state.editVehicle
  const editing = location.state?.editVehicle || null
  const isEdit = !!editing

  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const [f, setF] = useState({
    nickname: editing?.nickname || '',
    type: editing?.type || 'bike',
    make: editing?.make || '',
    model: editing?.model || '',
    year: editing?.year?.toString() || '',
    fuel_type: editing?.fuel_type || 'petrol',
    condition: editing?.condition || 'new',
    current_odometer: editing?.current_odometer?.toString() || '',

    // Service intervals
    oil_interval_km: editing?.oil_interval_km?.toString() || '',
    service_interval_km: editing?.service_interval_km?.toString() || '',

    // Last service data
    last_oil_change_km: editing?.last_oil_change_km?.toString() || '',
    last_oil_change_date: editing?.last_oil_change_date || '',
    last_service_km: editing?.last_service_km?.toString() || '',
    last_service_date: editing?.last_service_date || '',
    workshop_name: editing?.workshop_name || '',

    // Parts km
    air_filter_km: editing?.air_filter_km?.toString() || '',
    chain_km: editing?.chain_km?.toString() || '',
    brake_pads_km: editing?.brake_pads_km?.toString() || '',
    tyres_km: editing?.tyres_km?.toString() || '',

    // Documents
    insurance_expiry: editing?.insurance_expiry || '',
    puc_expiry: editing?.puc_expiry || '',
    battery_date: editing?.battery_date || '',
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
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
  }

  const back = () => {
    document.getElementById('sv-scroll')?.scrollTo(0, 0)
    setStep((s) => Math.max(0, s - 1))
  }

  const schedule = getServiceSchedule(f.make)

  // Auto-fill intervals from schedule if not manually set
  const oilInterval = f.oil_interval_km
    ? Number(f.oil_interval_km)
    : schedule.oil

  const serviceInterval = f.service_interval_km
    ? Number(f.service_interval_km)
    : schedule.service

  const save = async () => {
    setSaving(true)

    try {
      const odo = Number(f.current_odometer) || 0

      const payload = {
        nickname: f.nickname || `${f.make} ${f.model}`,
        type: f.type,
        make: f.make,
        model: f.model,
        year: f.year ? Number(f.year) : null,
        fuel_type: f.fuel_type,
        condition: f.condition,
        current_odometer: odo,

        oil_interval_km: oilInterval,
        service_interval_km: serviceInterval,

        last_oil_change_km: f.last_oil_change_km
          ? Number(f.last_oil_change_km)
          : isEdit
            ? editing.last_oil_change_km
            : odo,

        last_oil_change_date: f.last_oil_change_date || null,

        last_service_km: f.last_service_km
          ? Number(f.last_service_km)
          : isEdit
            ? editing.last_service_km
            : odo,

        last_service_date: f.last_service_date || null,
        workshop_name: f.workshop_name || null,

        air_filter_km: f.air_filter_km
          ? Number(f.air_filter_km)
          : isEdit
            ? editing.air_filter_km
            : odo,

        brake_pads_km: f.brake_pads_km
          ? Number(f.brake_pads_km)
          : isEdit
            ? editing.brake_pads_km
            : odo,

        tyres_km: f.tyres_km
          ? Number(f.tyres_km)
          : isEdit
            ? editing.tyres_km
            : odo,

        chain_km:
          f.type === 'bike' || f.type === 'scooter'
            ? f.chain_km
              ? Number(f.chain_km)
              : isEdit
                ? editing.chain_km
                : odo
            : null,

        insurance_expiry: f.insurance_expiry || null,
        puc_expiry: f.puc_expiry || null,

        battery_date:
          f.battery_date ||
          (isEdit
            ? editing.battery_date
            : new Date().toISOString().split('T')[0]),
      }

      if (isEdit) {
        await updateVehicle(editing.id, payload)
      } else {
        await addVehicle(payload)
      }

      nav('/dashboard', { replace: true })
    } catch (e) {
      alert(e.message)
    }

    setSaving(false)
  }

  const isBike = f.type === 'bike' || f.type === 'scooter'

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
                STEP {step + 1} OF {STEPS.length}
              </p>

              <h1 className="text-base font-bold text-[#f1f5f9]">
                {isEdit ? `Edit: ${editing.nickname}` : STEPS[step]}
              </h1>
            </div>

            <span className="text-[9px] text-[#64748b] bg-[#1e293b] px-2 py-0.5 rounded border border-[#334155]">
              {step + 1}/{STEPS.length}
            </span>
          </div>

          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all ${
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

            {step < STEPS.length - 1 ? (
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
                {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Vehicle'}
              </button>
            )}
          </div>
        </div>
      }
    >
      <div id="sv-scroll" className="px-5 py-5 space-y-4">
        {/* STEP 0: Basic Info */}
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

            <Input
              label="YEAR"
              value={f.year}
              onChange={(e) => set('year', e.target.value)}
              type="number"
              placeholder="2024"
            />

            <Pills
              label="CONDITION"
              options={[
                { value: 'new', label: '✨ New' },
                { value: 'used', label: '♻️ Used' },
              ]}
              value={f.condition}
              onChange={(v) => set('condition', v)}
            />

            <Pills
              label="FUEL TYPE"
              options={[
                { value: 'petrol', label: 'Petrol' },
                { value: 'diesel', label: 'Diesel' },
                { value: 'cng', label: 'CNG' },
                { value: 'ev', label: 'EV' },
              ]}
              value={f.fuel_type}
              onChange={(v) => set('fuel_type', v)}
            />

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

        {/* STEP 1: Odometer */}
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
                Accurate odometer = accurate mileage, service predictions, and
                part life tracking.
              </p>
            </Card>
          </>
        )}

        {/* STEP 2: Service, Parts, Intervals */}
        {step === 2 && (
          <>
            <p className="text-xs text-[#64748b]">
              {isEdit
                ? 'Update service history, part life, and intervals.'
                : "When was the last oil change & service? We'll predict the next ones."}
            </p>

            <Card className="p-4 space-y-3">
              <p className="text-caps text-[#f97316]">SERVICE INTERVALS</p>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="OIL CHANGE EVERY"
                  value={f.oil_interval_km || oilInterval.toString()}
                  onChange={(e) => set('oil_interval_km', e.target.value)}
                  type="number"
                  suffix="KM"
                  icon={Droplets}
                />

                <Input
                  label="SERVICE EVERY"
                  value={f.service_interval_km || serviceInterval.toString()}
                  onChange={(e) => set('service_interval_km', e.target.value)}
                  type="number"
                  suffix="KM"
                  icon={Wrench}
                />
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <p className="text-caps text-[#64748b]">LAST OIL CHANGE</p>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="AT KM"
                  value={f.last_oil_change_km}
                  onChange={(e) => set('last_oil_change_km', e.target.value)}
                  type="number"
                  suffix="KM"
                  icon={Gauge}
                  placeholder={`e.g. ${Math.max(
                    0,
                    (Number(f.current_odometer) || 0) - 2000
                  )}`}
                />

                <Input
                  label="DATE"
                  value={f.last_oil_change_date}
                  onChange={(e) => set('last_oil_change_date', e.target.value)}
                  type="date"
                  icon={Calendar}
                />
              </div>
            </Card>

            <Card className="p-4 space-y-3">
              <p className="text-caps text-[#64748b]">LAST GENERAL SERVICE</p>

              <Input
                label="AT KM"
                value={f.last_service_km}
                onChange={(e) => set('last_service_km', e.target.value)}
                type="number"
                suffix="KM"
                icon={Gauge}
                placeholder={`e.g. ${Math.max(
                  0,
                  (Number(f.current_odometer) || 0) - 3000
                )}`}
              />

              <Input
                label="DATE"
                value={f.last_service_date}
                onChange={(e) => set('last_service_date', e.target.value)}
                type="date"
                icon={Calendar}
              />

              <Input
                label="WORKSHOP"
                value={f.workshop_name}
                onChange={(e) => set('workshop_name', e.target.value)}
                placeholder="Service center name"
                icon={Wrench}
              />
            </Card>

            <Card className="p-4 space-y-3">
              <p className="text-caps text-[#64748b]">
                PARTS — LAST CHANGED AT KM
              </p>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="AIR FILTER"
                  value={f.air_filter_km}
                  onChange={(e) => set('air_filter_km', e.target.value)}
                  type="number"
                  icon={Wind}
                  placeholder="KM"
                />

                <Input
                  label="BRAKE PADS"
                  value={f.brake_pads_km}
                  onChange={(e) => set('brake_pads_km', e.target.value)}
                  type="number"
                  icon={Disc}
                  placeholder="KM"
                />

                <Input
                  label="TYRES"
                  value={f.tyres_km}
                  onChange={(e) => set('tyres_km', e.target.value)}
                  type="number"
                  icon={CircleDot}
                  placeholder="KM"
                />

                {isBike && (
                  <Input
                    label="CHAIN"
                    value={f.chain_km}
                    onChange={(e) => set('chain_km', e.target.value)}
                    type="number"
                    icon={Link2}
                    placeholder="KM"
                  />
                )}
              </div>

              <Input
                label="BATTERY INSTALLED"
                value={f.battery_date}
                onChange={(e) => set('battery_date', e.target.value)}
                type="date"
                icon={Battery}
              />
            </Card>

            <Card className="p-4 space-y-3">
              <p className="text-caps text-[#64748b]">DOCUMENTS</p>

              <Input
                label="INSURANCE EXPIRY"
                value={f.insurance_expiry}
                onChange={(e) => set('insurance_expiry', e.target.value)}
                type="date"
                icon={Shield}
              />

              <Input
                label="PUC EXPIRY"
                value={f.puc_expiry}
                onChange={(e) => set('puc_expiry', e.target.value)}
                type="date"
              />
            </Card>

            {(f.last_oil_change_km || f.last_service_km) && (
              <Card className="p-3 border-[#22c55e]/20 bg-[#22c55e]/5">
                <p className="text-[11px] font-semibold text-[#22c55e] mb-1">
                  📊 Predictions Ready
                </p>

                {f.last_oil_change_km && (
                  <p className="text-[10px] text-[#64748b]">
                    Next oil change: ~
                    {(
                      Number(f.last_oil_change_km) + oilInterval
                    ).toLocaleString()}{' '}
                    km
                  </p>
                )}

                {f.last_service_km && (
                  <p className="text-[10px] text-[#64748b]">
                    Next service: ~
                    {(
                      Number(f.last_service_km) + serviceInterval
                    ).toLocaleString()}{' '}
                    km
                  </p>
                )}
              </Card>
            )}
          </>
        )}

        {/* STEP 3: Review */}
        {step === 3 && (
          <>
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-[#22c55e]/10 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-7 h-7 text-[#22c55e]" />
              </div>

              <h2 className="text-lg font-bold text-[#f1f5f9] mb-1">
                {isEdit ? 'Review Changes' : 'Ready to Go!'}
              </h2>

              <p className="text-xs text-[#64748b]">
                {isEdit
                  ? 'Confirm your updates below.'
                  : 'GearLog will track mileage, predict services, and remind you.'}
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
                <span className="text-[#64748b]">Condition</span>
                <span className="text-[#f1f5f9] font-semibold capitalize">
                  {f.condition}
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-[#64748b]">Odometer</span>
                <span className="text-[#f1f5f9] font-semibold">
                  {Number(f.current_odometer || 0).toLocaleString()} km
                </span>
              </div>

              <div className="border-t border-[#334155] my-1" />

              <div className="flex justify-between text-xs">
                <span className="text-[#64748b]">Oil interval</span>
                <span className="text-[#f97316] font-semibold">
                  {oilInterval.toLocaleString()} km
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-[#64748b]">Service interval</span>
                <span className="text-[#f97316] font-semibold">
                  {serviceInterval.toLocaleString()} km
                </span>
              </div>

              {f.insurance_expiry && (
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748b]">Insurance</span>
                  <span className="text-[#f1f5f9] font-semibold">
                    {f.insurance_expiry}
                  </span>
                </div>
              )}

              {f.puc_expiry && (
                <div className="flex justify-between text-xs">
                  <span className="text-[#64748b]">PUC</span>
                  <span className="text-[#f1f5f9] font-semibold">
                    {f.puc_expiry}
                  </span>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </PageShell>
  )
}