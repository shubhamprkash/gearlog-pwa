/**
 * GLOBAL STATE — React Context based store
 * Vehicle-first architecture: everything revolves around the active vehicle
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { supabase } from './supabase'
import {
  demoUser,
  demoVehicles,
  demoFuelLogs,
  demoServiceLogs,
  demoTrips,
} from './demoData'
import {
  calculateMileage,
  fuelAnalytics,
  calculatePartHealth,
  calculateHealthScore,
  getActiveReminders,
  costPerKm,
} from './smartCalc'

const Ctx = createContext({})
export const useStore = () => useContext(Ctx)

export function StoreProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isDemo, setIsDemo] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [vehicles, setVehicles] = useState([])
  const [fuelLogs, setFuelLogs] = useState([])
  const [serviceLogs, setServiceLogs] = useState([])
  const [trips, setTrips] = useState([])
  const [dataLoading, setDataLoading] = useState(false)
  const [activeVehicleId, setActiveVehicleId] = useState(() => {
    return localStorage.getItem('gearlog_active_vehicle') || null
  })

  useEffect(() => {
    if (activeVehicleId) localStorage.setItem('gearlog_active_vehicle', activeVehicleId)
  }, [activeVehicleId])

  // ─── AUTH ──────────────────────────────────────
  useEffect(() => {
    handleOAuthCallback()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) { setUser(session.user); fetchProfile(session.user.id); setIsDemo(false) }
      else { setUser(null); setProfile(null) }
      setAuthLoading(false)
    })
    return () => subscription?.unsubscribe()
  }, [])

  async function handleOAuthCallback() {
    try {
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
          if (!error && data.session?.user) { setUser(data.session.user); fetchProfile(data.session.user.id); setIsDemo(false) }
          window.history.replaceState(null, '', window.location.pathname)
          setAuthLoading(false); return
        }
      }
      const url = new URL(window.location.href), code = url.searchParams.get('code')
      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error && data.session?.user) { setUser(data.session.user); fetchProfile(data.session.user.id); setIsDemo(false) }
        window.history.replaceState(null, '', url.pathname)
        setAuthLoading(false); return
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) { setUser(session.user); await fetchProfile(session.user.id); setIsDemo(false) }
    } catch (e) { console.log('[Auth] Init error:', e.message) }
    setAuthLoading(false)
  }

  async function fetchProfile(uid) {
    try { const { data } = await supabase.from('profiles').select('*').eq('id', uid).single(); if (data) setProfile(data) } catch (e) {}
  }

  async function updateProfile(updates) {
    const cleanUpdates = { full_name: updates.full_name || '', avatar_url: updates.avatar_url || null }
    if (isDemo) { setProfile(p => ({ ...p, ...cleanUpdates })); return }
    if (!user?.id) throw new Error('User not authenticated')
    const { data, error } = await supabase.from('profiles').update(cleanUpdates).eq('id', user.id).select().maybeSingle()
    if (error) throw error
    if (data) { setProfile(data); return data }
    const { data: ins, error: ie } = await supabase.from('profiles').insert({ id: user.id, ...cleanUpdates }).select().single()
    if (ie) throw ie
    setProfile(ins); return ins
  }

  const signIn = async (email, pw) => { const { error } = await supabase.auth.signInWithPassword({ email, password: pw }); if (error) throw error }
  const signUp = async (email, pw, name) => { const { error } = await supabase.auth.signUp({ email, password: pw, options: { data: { full_name: name } } }); if (error) throw error }
  const signInGoogle = async () => { const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/dashboard' } }); if (error) throw error }
  const signOut = async () => { if (isDemo) { setUser(null); setProfile(null); setIsDemo(false); setVehicles([]); setFuelLogs([]); setServiceLogs([]); setTrips([]); return } await supabase.auth.signOut() }

  function loginDemo() {
    setUser(demoUser); setProfile({ full_name: demoUser.full_name, avatar_url: demoUser.avatar_url || null }); setIsDemo(true)
    setVehicles(demoVehicles); setFuelLogs(demoFuelLogs); setServiceLogs(demoServiceLogs); setTrips(demoTrips)
    if (!activeVehicleId || !demoVehicles.find(v => v.id === activeVehicleId)) setActiveVehicleId(demoVehicles[0]?.id || null)
  }

  // ─── DATA ─────────────────────────────────────
  const loadData = useCallback(async () => {
    if (!user || isDemo) return; setDataLoading(true)
    try {
      const [v, f, s, t] = await Promise.all([
        supabase.from('vehicles').select('*').eq('user_id', user.id).order('created_at'),
        supabase.from('fuel_logs').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('service_logs').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('trips').select('*').eq('user_id', user.id).order('date', { ascending: false }),
      ])
      setVehicles(v.data || []); setFuelLogs(f.data || []); setServiceLogs(s.data || []); setTrips(t.data || [])
      if (!activeVehicleId && v.data?.length) setActiveVehicleId(v.data[0].id)
    } catch (e) { console.error(e) }
    setDataLoading(false)
  }, [user, isDemo, activeVehicleId])

  useEffect(() => { if (user && !isDemo) loadData() }, [user, isDemo, loadData])

  // ─── SMART ODOMETER: recalculate from all logs ──────────
  // Returns the highest odometer reading across all logs for a vehicle
  function recalcOdometer(vehicleId, excludeType, excludeId) {
    let maxOdo = 0
    fuelLogs.forEach(f => {
      if (f.vehicle_id !== vehicleId) return
      if (excludeType === 'fuel' && f.id === excludeId) return
      if (f.odometer > maxOdo) maxOdo = f.odometer
    })
    serviceLogs.forEach(s => {
      if (s.vehicle_id !== vehicleId) return
      if (excludeType === 'service' && s.id === excludeId) return
      if (s.odometer > maxOdo) maxOdo = s.odometer
    })
    trips.forEach(t => {
      if (t.vehicle_id !== vehicleId) return
      if (excludeType === 'trip' && t.id === excludeId) return
      const endKm = t.end_km || 0
      if (endKm > maxOdo) maxOdo = endKm
    })
    // Also check the vehicle's own odometer from creation
    const v = vehicles.find(v => v.id === vehicleId)
    // We return max of all logs, but NOT below what was manually set minus the deleted entry
    return maxOdo
  }

  async function syncOdometerAfterDelete(vehicleId, deletedType, deletedId) {
    const newOdo = recalcOdometer(vehicleId, deletedType, deletedId)
    const v = vehicles.find(v => v.id === vehicleId)
    if (v && newOdo < v.current_odometer) {
      await updateVehicle(vehicleId, { current_odometer: newOdo > 0 ? newOdo : v.current_odometer })
    }
  }

  // ─── VEHICLE CRUD ─────────────────────────────
  async function addVehicle(v) {
    if (isDemo) { const nv = { ...v, id: `v${Date.now()}`, user_id: user.id }; setVehicles(p => [...p, nv]); setActiveVehicleId(nv.id); return nv }
    const { data, error } = await supabase.from('vehicles').insert({ ...v, user_id: user.id }).select().single()
    if (error) throw error; setVehicles(p => [...p, data]); setActiveVehicleId(data.id); return data
  }
  async function updateVehicle(id, u) {
    if (isDemo) { setVehicles(p => p.map(v => v.id === id ? { ...v, ...u } : v)); return }
    const { error } = await supabase.from('vehicles').update(u).eq('id', id)
    if (error) throw error; setVehicles(p => p.map(v => v.id === id ? { ...v, ...u } : v))
  }
  async function deleteVehicle(id) {
    if (isDemo) { setVehicles(p => p.filter(v => v.id !== id)); setFuelLogs(p => p.filter(f => f.vehicle_id !== id)); setServiceLogs(p => p.filter(s => s.vehicle_id !== id)); setTrips(p => p.filter(t => t.vehicle_id !== id)); if (activeVehicleId === id) setActiveVehicleId(vehicles.find(v => v.id !== id)?.id || null); return }
    const { error } = await supabase.from('vehicles').delete().eq('id', id); if (error) throw error
    setVehicles(p => p.filter(v => v.id !== id)); if (activeVehicleId === id) setActiveVehicleId(vehicles.find(v => v.id !== id)?.id || null)
  }

  // ─── FUEL LOG CRUD ────────────────────────────
  async function addFuelLog(l) {
    if (isDemo) { const n = { ...l, id: `f${Date.now()}`, user_id: user.id }; setFuelLogs(p => [n, ...p]); return n }
    const { data, error } = await supabase.from('fuel_logs').insert({ ...l, user_id: user.id }).select().single(); if (error) throw error; setFuelLogs(p => [data, ...p]); return data
  }
  async function updateFuelLog(id, u) {
    if (isDemo) { setFuelLogs(p => p.map(f => f.id === id ? { ...f, ...u } : f)); return }
    const { error } = await supabase.from('fuel_logs').update(u).eq('id', id); if (error) throw error; setFuelLogs(p => p.map(f => f.id === id ? { ...f, ...u } : f))
  }
  async function deleteFuelLog(id) {
    const log = fuelLogs.find(f => f.id === id)
    if (isDemo) { setFuelLogs(p => p.filter(f => f.id !== id)); if (log) syncOdometerAfterDelete(log.vehicle_id, 'fuel', id); return }
    const { error } = await supabase.from('fuel_logs').delete().eq('id', id); if (error) throw error
    setFuelLogs(p => p.filter(f => f.id !== id))
    if (log) syncOdometerAfterDelete(log.vehicle_id, 'fuel', id)
  }

  // ─── SERVICE LOG CRUD ─────────────────────────
  async function addServiceLog(l) {
    if (isDemo) { const n = { ...l, id: `s${Date.now()}`, user_id: user.id }; setServiceLogs(p => [n, ...p]); return n }
    const { data, error } = await supabase.from('service_logs').insert({ ...l, user_id: user.id }).select().single(); if (error) throw error; setServiceLogs(p => [data, ...p]); return data
  }
  async function updateServiceLog(id, u) {
    if (isDemo) { setServiceLogs(p => p.map(s => s.id === id ? { ...s, ...u } : s)); return }
    const { error } = await supabase.from('service_logs').update(u).eq('id', id); if (error) throw error; setServiceLogs(p => p.map(s => s.id === id ? { ...s, ...u } : s))
  }
  async function deleteServiceLog(id) {
    const log = serviceLogs.find(s => s.id === id)
    if (isDemo) { setServiceLogs(p => p.filter(s => s.id !== id)); if (log) syncOdometerAfterDelete(log.vehicle_id, 'service', id); return }
    const { error } = await supabase.from('service_logs').delete().eq('id', id); if (error) throw error
    setServiceLogs(p => p.filter(s => s.id !== id))
    if (log) syncOdometerAfterDelete(log.vehicle_id, 'service', id)
  }

  // ─── TRIP CRUD ────────────────────────────────
  async function addTrip(t) {
    if (isDemo) { const n = { ...t, id: `t${Date.now()}`, user_id: user.id, distance: t.end_km - t.start_km }; setTrips(p => [n, ...p]); return n }
    const { data, error } = await supabase.from('trips').insert({ ...t, user_id: user.id }).select().single(); if (error) throw error; setTrips(p => [data, ...p]); return data
  }
  async function updateTrip(id, u) {
    if (isDemo) { setTrips(p => p.map(t => t.id === id ? { ...t, ...u, distance: (u.end_km || t.end_km) - (u.start_km || t.start_km) } : t)); return }
    const { error } = await supabase.from('trips').update(u).eq('id', id); if (error) throw error; setTrips(p => p.map(t => t.id === id ? { ...t, ...u } : t))
  }
  async function deleteTrip(id) {
    const log = trips.find(t => t.id === id)
    if (isDemo) { setTrips(p => p.filter(t => t.id !== id)); if (log) syncOdometerAfterDelete(log.vehicle_id, 'trip', id); return }
    const { error } = await supabase.from('trips').delete().eq('id', id); if (error) throw error
    setTrips(p => p.filter(t => t.id !== id))
    if (log) syncOdometerAfterDelete(log.vehicle_id, 'trip', id)
  }

  // ─── COMPUTED ─────────────────────────────────
  const activeVehicle = useMemo(() => vehicles.find(v => v.id === activeVehicleId) || null, [vehicles, activeVehicleId])
  const vFuel = useMemo(() => fuelLogs.filter(f => f.vehicle_id === activeVehicleId), [fuelLogs, activeVehicleId])
  const vService = useMemo(() => serviceLogs.filter(s => s.vehicle_id === activeVehicleId), [serviceLogs, activeVehicleId])
  const vTrips = useMemo(() => trips.filter(t => t.vehicle_id === activeVehicleId), [trips, activeVehicleId])
  const mileage = useMemo(() => calculateMileage(vFuel), [vFuel])
  const fuel = useMemo(() => fuelAnalytics(vFuel), [vFuel])
  const parts = useMemo(() => activeVehicle ? calculatePartHealth(activeVehicle, vService) : {}, [activeVehicle, vService])
  const health = useMemo(() => calculateHealthScore(parts), [parts])
  const reminders = useMemo(() => activeVehicle ? getActiveReminders(parts, activeVehicle.nickname) : [], [parts, activeVehicle])
  const costKm = useMemo(() => costPerKm(vFuel, vService), [vFuel, vService])

  return (
    <Ctx.Provider value={{
      user, profile, isDemo, authLoading,
      signIn, signUp, signInGoogle, signOut, loginDemo, fetchProfile, updateProfile,
      vehicles, fuelLogs, serviceLogs, trips, dataLoading,
      addVehicle, updateVehicle, deleteVehicle,
      addFuelLog, updateFuelLog, deleteFuelLog,
      addServiceLog, updateServiceLog, deleteServiceLog,
      addTrip, updateTrip, deleteTrip,
      loadData, activeVehicleId, setActiveVehicleId, activeVehicle,
      vFuel, vService, vTrips,
      mileage, fuel, parts, health, reminders, costKm,
    }}>
      {children}
    </Ctx.Provider>
  )
}
