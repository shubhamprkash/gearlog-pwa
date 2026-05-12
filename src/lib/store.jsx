/**
 * GLOBAL STATE — React Context based store
 * Vehicle-first architecture: everything revolves around the active vehicle
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { supabase } from './supabase'
import { demoUser, demoVehicles, demoFuelLogs, demoServiceLogs, demoTrips } from './demoData'
import { calculateMileage, fuelAnalytics, calculatePartHealth, calculateHealthScore, getActiveReminders, costPerKm } from './smartCalc'

const Ctx = createContext({})
export const useStore = () => useContext(Ctx)

export function StoreProvider({ children }) {
  // Auth
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isDemo, setIsDemo] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

  // Data
  const [vehicles, setVehicles] = useState([])
  const [fuelLogs, setFuelLogs] = useState([])
  const [serviceLogs, setServiceLogs] = useState([])
  const [trips, setTrips] = useState([])
  const [dataLoading, setDataLoading] = useState(false)

  // Active vehicle — the core of the UX
  const [activeVehicleId, setActiveVehicleId] = useState(() => localStorage.getItem('gearlog_active_vehicle') || null)

  // Persist active vehicle
  useEffect(() => {
    if (activeVehicleId) localStorage.setItem('gearlog_active_vehicle', activeVehicleId)
  }, [activeVehicleId])

  // ─── AUTH ──────────────────────────────────────
  useEffect(() => {
    handleOAuthCallback()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('[Auth]', event, session?.user?.email)
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
        setIsDemo(false)
      } else {
        setUser(null)
        setProfile(null)
      }
      setAuthLoading(false)
    })
    return () => subscription?.unsubscribe()
  }, [])

  /**
   * Handle OAuth callback — Supabase returns tokens in URL hash fragment
   * e.g. https://yourapp.com/#access_token=...&refresh_token=...
   * OR in query params for PKCE flow
   * We need to extract these and set the session
   */
  async function handleOAuthCallback() {
    try {
      // Check if URL has hash fragment with access_token (implicit flow)
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        // Parse the hash
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        if (accessToken && refreshToken) {
          console.log('[Auth] Setting session from OAuth callback hash')
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (error) {
            console.error('[Auth] Error setting session from hash:', error.message)
          } else if (data.session?.user) {
            setUser(data.session.user)
            fetchProfile(data.session.user.id)
            setIsDemo(false)
          }
          // Clean the URL — remove hash fragment so it doesn't linger
          window.history.replaceState(null, '', window.location.pathname)
          setAuthLoading(false)
          return
        }
      }

      // Check for code in query params (PKCE flow)
      const url = new URL(window.location.href)
      const code = url.searchParams.get('code')
      if (code) {
        console.log('[Auth] Exchanging code from OAuth callback')
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          console.error('[Auth] Error exchanging code:', error.message)
        } else if (data.session?.user) {
          setUser(data.session.user)
          fetchProfile(data.session.user.id)
          setIsDemo(false)
        }
        // Clean URL
        url.searchParams.delete('code')
        window.history.replaceState(null, '', url.pathname)
        setAuthLoading(false)
        return
      }

      // No OAuth callback — just check existing session
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id)
        setIsDemo(false)
      }
    } catch (e) {
      console.log('[Auth] Init error:', e.message)
    }
    setAuthLoading(false)
  }

  async function fetchProfile(uid) {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', uid).single()
      if (data) setProfile(data)
    } catch (e) {}
  }

  const signIn = async (email, pw) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw })
    if (error) throw error
  }

  const signUp = async (email, pw, name) => {
    const { error } = await supabase.auth.signUp({
      email,
      password: pw,
      options: { data: { full_name: name } }
    })
    if (error) throw error
  }

  const signInGoogle = async () => {
    // Use the current origin as redirect — works for both localhost and production
    const redirectUrl = window.location.origin + '/dashboard'
    console.log('[Auth] Google OAuth redirect URL:', redirectUrl)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    if (isDemo) {
      setUser(null)
      setProfile(null)
      setIsDemo(false)
      setVehicles([])
      return
    }
    await supabase.auth.signOut()
  }

  function loginDemo() {
    setUser(demoUser)
    setProfile({ full_name: demoUser.full_name })
    setIsDemo(true)
    setVehicles(demoVehicles)
    setFuelLogs(demoFuelLogs)
    setServiceLogs(demoServiceLogs)
    setTrips(demoTrips)
    if (!activeVehicleId || !demoVehicles.find(v => v.id === activeVehicleId))
      setActiveVehicleId(demoVehicles[0]?.id || null)
  }

  // ─── DATA LOADING ─────────────────────────────
  const loadData = useCallback(async () => {
    if (!user || isDemo) return
    setDataLoading(true)
    try {
      const [v, f, s, t] = await Promise.all([
        supabase.from('vehicles').select('*').eq('user_id', user.id).order('created_at'),
        supabase.from('fuel_logs').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('service_logs').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('trips').select('*').eq('user_id', user.id).order('date', { ascending: false }),
      ])
      setVehicles(v.data || [])
      setFuelLogs(f.data || [])
      setServiceLogs(s.data || [])
      setTrips(t.data || [])
      // Auto-select first vehicle if none selected
      if (!activeVehicleId && v.data?.length) setActiveVehicleId(v.data[0].id)
    } catch (e) {
      console.error(e)
    }
    setDataLoading(false)
  }, [user, isDemo])

  useEffect(() => {
    if (user && !isDemo) loadData()
  }, [user, isDemo, loadData])

  // ─── VEHICLE CRUD ─────────────────────────────
  async function addVehicle(v) {
    if (isDemo) { const nv = { ...v, id: `v${Date.now()}`, user_id: user.id }; setVehicles(p => [...p, nv]); setActiveVehicleId(nv.id); return nv }
    const { data, error } = await supabase.from('vehicles').insert({ ...v, user_id: user.id }).select().single()
    if (error) throw error; setVehicles(p => [...p, data]); setActiveVehicleId(data.id); return data
  }
  async function updateVehicle(id, u) {
    if (isDemo) { setVehicles(p => p.map(v => v.id === id ? { ...v, ...u } : v)); return }
    await supabase.from('vehicles').update(u).eq('id', id); setVehicles(p => p.map(v => v.id === id ? { ...v, ...u } : v))
  }
  async function deleteVehicle(id) {
    if (isDemo) { setVehicles(p => p.filter(v => v.id !== id)); setFuelLogs(p => p.filter(f => f.vehicle_id !== id)); setServiceLogs(p => p.filter(s => s.vehicle_id !== id)); setTrips(p => p.filter(t => t.vehicle_id !== id)); if (activeVehicleId === id) setActiveVehicleId(vehicles.find(v => v.id !== id)?.id || null); return }
    await supabase.from('vehicles').delete().eq('id', id); setVehicles(p => p.filter(v => v.id !== id)); if (activeVehicleId === id) setActiveVehicleId(vehicles.find(v => v.id !== id)?.id || null)
  }

  // ─── FUEL LOG CRUD ────────────────────────────
  async function addFuelLog(l) {
    if (isDemo) { const n = { ...l, id: `f${Date.now()}`, user_id: user.id }; setFuelLogs(p => [n, ...p]); return n }
    const { data, error } = await supabase.from('fuel_logs').insert({ ...l, user_id: user.id }).select().single(); if (error) throw error; setFuelLogs(p => [data, ...p]); return data
  }
  async function deleteFuelLog(id) {
    if (isDemo) { setFuelLogs(p => p.filter(f => f.id !== id)); return }
    await supabase.from('fuel_logs').delete().eq('id', id); setFuelLogs(p => p.filter(f => f.id !== id))
  }

  // ─── SERVICE LOG CRUD ─────────────────────────
  async function addServiceLog(l) {
    if (isDemo) { const n = { ...l, id: `s${Date.now()}`, user_id: user.id }; setServiceLogs(p => [n, ...p]); return n }
    const { data, error } = await supabase.from('service_logs').insert({ ...l, user_id: user.id }).select().single(); if (error) throw error; setServiceLogs(p => [data, ...p]); return data
  }

  // ─── TRIP CRUD ────────────────────────────────
  async function addTrip(t) {
    if (isDemo) { const n = { ...t, id: `t${Date.now()}`, user_id: user.id, distance: t.end_km - t.start_km }; setTrips(p => [n, ...p]); return n }
    const { data, error } = await supabase.from('trips').insert({ ...t, user_id: user.id }).select().single(); if (error) throw error; setTrips(p => [data, ...p]); return data
  }

  // ─── COMPUTED: Active vehicle + smart data ────
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
      // Auth
      user, profile, isDemo, authLoading,
      signIn, signUp, signInGoogle, signOut, loginDemo, fetchProfile,
      // Data
      vehicles, fuelLogs, serviceLogs, trips, dataLoading,
      addVehicle, updateVehicle, deleteVehicle,
      addFuelLog, deleteFuelLog, addServiceLog, addTrip, loadData,
      // Active vehicle
      activeVehicleId, setActiveVehicleId, activeVehicle,
      vFuel, vService, vTrips,
      // Smart computed
      mileage, fuel, parts, health, reminders, costKm,
    }}>
      {children}
    </Ctx.Provider>
  )
}
