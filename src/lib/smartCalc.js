/**
 * SMART CALCULATIONS ENGINE
 * All the intelligence behind GearLog's predictions
 */

// ─── MILEAGE CALCULATION ───────────────────────────────────
// Uses consecutive full-tank fill-ups for accuracy
export function calculateMileage(fuelLogs) {
  // Sort by odometer ascending
  const sorted = [...fuelLogs]
    .filter(f => f.odometer && f.litres)
    .sort((a, b) => a.odometer - b.odometer)

  if (sorted.length < 2) return { current: null, average: null, trend: [], best: null, worst: null }

  const entries = []
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]
    const curr = sorted[i]
    const dist = curr.odometer - prev.odometer
    if (dist > 0 && curr.litres > 0) {
      const kmpl = parseFloat((dist / curr.litres).toFixed(1))
      entries.push({
        date: curr.date,
        kmpl,
        dist,
        litres: curr.litres,
        cost: curr.total_cost,
      })
    }
  }

  if (entries.length === 0) return { current: null, average: null, trend: [], best: null, worst: null }

  const avg = parseFloat((entries.reduce((s, e) => s + e.kmpl, 0) / entries.length).toFixed(1))
  const best = Math.max(...entries.map(e => e.kmpl))
  const worst = Math.min(...entries.map(e => e.kmpl))

  return {
    current: entries[entries.length - 1].kmpl,
    average: avg,
    trend: entries.slice(-8), // last 8 for chart
    best,
    worst,
  }
}

// ─── FUEL COST ANALYTICS ───────────────────────────────────
export function fuelAnalytics(fuelLogs) {
  const now = new Date()
  const thisMonth = fuelLogs.filter(f => {
    const d = new Date(f.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const lastMonth = fuelLogs.filter(f => {
    const d = new Date(f.date)
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear()
  })

  const thisMonthCost = thisMonth.reduce((s, f) => s + (f.total_cost || 0), 0)
  const lastMonthCost = lastMonth.reduce((s, f) => s + (f.total_cost || 0), 0)
  const totalCost = fuelLogs.reduce((s, f) => s + (f.total_cost || 0), 0)
  const totalLitres = fuelLogs.reduce((s, f) => s + (f.litres || 0), 0)
  const avgCostPerLitre = totalLitres > 0 ? parseFloat((totalCost / totalLitres).toFixed(1)) : 0

  return { thisMonthCost, lastMonthCost, totalCost, totalLitres, avgCostPerLitre }
}

// ─── SERVICE PREDICTIONS ───────────────────────────────────
// Pre-loaded schedules for popular Indian vehicles
const SERVICE_PRESETS = {
  // Bikes
  'royal enfield': { oil: 5000, service: 10000, chain: 1000, air_filter: 10000, brake_pads: 15000, tyres: 25000, battery_months: 36 },
  'hero': { oil: 3500, service: 6000, chain: 800, air_filter: 8000, brake_pads: 12000, tyres: 20000, battery_months: 24 },
  'honda': { oil: 4000, service: 6000, chain: 1000, air_filter: 8000, brake_pads: 12000, tyres: 20000, battery_months: 30 },
  'bajaj': { oil: 4000, service: 6000, chain: 800, air_filter: 8000, brake_pads: 12000, tyres: 20000, battery_months: 24 },
  'tvs': { oil: 3500, service: 6000, chain: 800, air_filter: 8000, brake_pads: 12000, tyres: 20000, battery_months: 24 },
  'yamaha': { oil: 4000, service: 6000, chain: 1000, air_filter: 8000, brake_pads: 12000, tyres: 20000, battery_months: 30 },
  'ktm': { oil: 5000, service: 7500, chain: 1000, air_filter: 10000, brake_pads: 12000, tyres: 18000, battery_months: 30 },
  'suzuki': { oil: 4000, service: 6000, chain: 1000, air_filter: 8000, brake_pads: 12000, tyres: 20000, battery_months: 30 },
  'kawasaki': { oil: 6000, service: 10000, chain: 1000, air_filter: 10000, brake_pads: 15000, tyres: 20000, battery_months: 36 },
  // Cars
  'maruti': { oil: 10000, service: 10000, air_filter: 15000, brake_pads: 30000, tyres: 40000, battery_months: 48 },
  'hyundai': { oil: 10000, service: 10000, air_filter: 15000, brake_pads: 30000, tyres: 40000, battery_months: 48 },
  'tata': { oil: 10000, service: 10000, air_filter: 15000, brake_pads: 30000, tyres: 40000, battery_months: 48 },
  'mahindra': { oil: 10000, service: 10000, air_filter: 15000, brake_pads: 30000, tyres: 40000, battery_months: 48 },
  'toyota': { oil: 10000, service: 10000, air_filter: 15000, brake_pads: 35000, tyres: 45000, battery_months: 48 },
  'kia': { oil: 10000, service: 10000, air_filter: 15000, brake_pads: 30000, tyres: 40000, battery_months: 48 },
  'land rover': { oil: 15000, service: 15000, air_filter: 20000, brake_pads: 35000, tyres: 40000, battery_months: 48 },
  'volkswagen': { oil: 15000, service: 15000, air_filter: 20000, brake_pads: 30000, tyres: 40000, battery_months: 48 },
}

// Fallback
const DEFAULT_SCHEDULE = { oil: 5000, service: 10000, chain: 1000, air_filter: 10000, brake_pads: 15000, tyres: 30000, battery_months: 36 }

export function getServiceSchedule(make) {
  const key = (make || '').toLowerCase()
  for (const [brand, schedule] of Object.entries(SERVICE_PRESETS)) {
    if (key.includes(brand)) return { ...schedule, source: 'preset' }
  }
  return { ...DEFAULT_SCHEDULE, source: 'default' }
}

// ─── PART HEALTH & PREDICTIONS ─────────────────────────────
export function calculatePartHealth(vehicle, serviceLogs) {
  const schedule = getServiceSchedule(vehicle.make)
  const odo = vehicle.current_odometer || 0
  const isBike = vehicle.type === 'bike' || vehicle.type === 'scooter'

  function partStatus(lastKm, intervalKm) {
    if (!lastKm || !intervalKm) return { status: 'unknown', remaining: null, percent: 0 }
    const used = odo - lastKm
    const remaining = Math.max(0, intervalKm - used)
    const percent = Math.min(100, Math.round((used / intervalKm) * 100))
    let status = 'ok'
    if (percent >= 100) status = 'overdue'
    else if (percent >= 80) status = 'due_soon'
    return { status, remaining, percent, nextDueKm: lastKm + intervalKm }
  }

  function dateStatus(dateStr, intervalMonths) {
    if (!dateStr || !intervalMonths) return { status: 'unknown', daysLeft: null }
    const d = new Date(dateStr)
    const due = new Date(d.getFullYear(), d.getMonth() + intervalMonths, d.getDate())
    const daysLeft = Math.ceil((due - new Date()) / 86400000)
    let status = 'ok'
    if (daysLeft <= 0) status = 'overdue'
    else if (daysLeft <= 14) status = 'due_soon'
    return { status, daysLeft, dueDate: due }
  }

  function expiryStatus(dateStr) {
    if (!dateStr) return { status: 'unknown', daysLeft: null }
    const due = new Date(dateStr)
    const daysLeft = Math.ceil((due - new Date()) / 86400000)
    let status = 'ok'
    if (daysLeft <= 0) status = 'overdue'
    else if (daysLeft <= 14) status = 'due_soon'
    return { status, daysLeft, dueDate: due }
  }

  const parts = {
    engine_oil: { label: 'Engine Oil', icon: 'droplets', ...partStatus(vehicle.last_oil_change_km, schedule.oil) },
    general_service: { label: 'General Service', icon: 'wrench', ...partStatus(vehicle.last_service_km, schedule.service) },
    air_filter: { label: 'Air Filter', icon: 'wind', ...partStatus(vehicle.air_filter_km, schedule.air_filter) },
    brake_pads: { label: 'Brake Pads', icon: 'disc', ...partStatus(vehicle.brake_pads_km, schedule.brake_pads) },
    tyres: { label: 'Tyres', icon: 'circle', ...partStatus(vehicle.tyres_km, schedule.tyres) },
    battery: { label: 'Battery', icon: 'battery', ...dateStatus(vehicle.battery_date, schedule.battery_months) },
  }

  if (isBike && schedule.chain) {
    parts.chain = { label: 'Chain & Sprocket', icon: 'link', ...partStatus(vehicle.chain_km, schedule.chain) }
  }

  // Expiry items
  if (vehicle.insurance_expiry) {
    parts.insurance = { label: 'Insurance', icon: 'shield', ...expiryStatus(vehicle.insurance_expiry) }
  }
  if (vehicle.puc_expiry) {
    parts.puc = { label: 'PUC Certificate', icon: 'leaf', ...expiryStatus(vehicle.puc_expiry) }
  }

  return parts
}

// ─── OVERALL HEALTH SCORE ──────────────────────────────────
export function calculateHealthScore(parts) {
  const items = Object.values(parts).filter(p => p.status !== 'unknown')
  if (items.length === 0) return 100

  let score = 100
  for (const p of items) {
    if (p.status === 'overdue') score -= (100 / items.length)
    else if (p.status === 'due_soon') score -= (100 / items.length) * 0.4
  }
  return Math.max(0, Math.round(score))
}

// ─── SMART REMINDERS (only within 2 weeks) ─────────────────
export function getActiveReminders(parts, vehicleName) {
  const reminders = []
  for (const [key, part] of Object.entries(parts)) {
    if (part.status === 'overdue') {
      reminders.push({ key, ...part, vehicle: vehicleName, urgency: 'overdue', message: part.remaining != null ? `Overdue by ${Math.abs(part.remaining).toLocaleString()} km` : `Expired ${Math.abs(part.daysLeft)} days ago` })
    } else if (part.status === 'due_soon') {
      reminders.push({ key, ...part, vehicle: vehicleName, urgency: 'soon', message: part.remaining != null ? `${part.remaining.toLocaleString()} km remaining` : `${part.daysLeft} days left` })
    }
  }
  return reminders.sort((a, b) => (a.urgency === 'overdue' ? -1 : 1) - (b.urgency === 'overdue' ? -1 : 1))
}

// ─── COST PER KM ───────────────────────────────────────────
export function costPerKm(fuelLogs, serviceLogs) {
  const fuelCost = fuelLogs.reduce((s, f) => s + (f.total_cost || 0), 0)
  const serviceCost = serviceLogs.reduce((s, f) => s + (f.total_cost || 0), 0)
  const totalCost = fuelCost + serviceCost
  if (fuelLogs.length < 2) return null
  const sorted = [...fuelLogs].sort((a, b) => a.odometer - b.odometer)
  const dist = sorted[sorted.length - 1].odometer - sorted[0].odometer
  if (dist <= 0) return null
  return parseFloat((totalCost / dist).toFixed(1))
}
