import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import {
  demoVehicles, demoFuelLogs, demoServiceLogs,
  demoTrips, demoReminders, demoRecentActivity
} from '../lib/demoData'

const DataContext = createContext({})
export const useData = () => useContext(DataContext)

export function DataProvider({ children }) {
  const { user, isDemo } = useAuth()
  const [vehicles, setVehicles] = useState([])
  const [fuelLogs, setFuelLogs] = useState([])
  const [serviceLogs, setServiceLogs] = useState([])
  const [trips, setTrips] = useState([])
  const [reminders, setReminders] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    if (isDemo) {
      setVehicles(demoVehicles)
      setFuelLogs(demoFuelLogs)
      setServiceLogs(demoServiceLogs)
      setTrips(demoTrips)
      setReminders(demoReminders)
      setRecentActivity(demoRecentActivity)
      setLoading(false)
      return
    }

    try {
      const [v, f, s, t, r] = await Promise.all([
        supabase.from('vehicles').select('*').eq('user_id', user.id).order('created_at'),
        supabase.from('fuel_logs').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('service_logs').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('trips').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('reminders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      ])

      setVehicles(v.data || [])
      setFuelLogs(f.data || [])
      setServiceLogs(s.data || [])
      setTrips(t.data || [])
      setReminders(r.data || [])
    } catch (e) {
      console.error('Data load error:', e)
    }
    setLoading(false)
  }, [user, isDemo])

  useEffect(() => { loadData() }, [loadData])

  // Vehicle CRUD
  async function addVehicle(vehicle) {
    if (isDemo) {
      const newV = { ...vehicle, id: `v${Date.now()}`, user_id: user.id }
      setVehicles(prev => [...prev, newV])
      return newV
    }
    const { data, error } = await supabase.from('vehicles').insert({ ...vehicle, user_id: user.id }).select().single()
    if (error) throw error
    setVehicles(prev => [...prev, data])
    return data
  }

  async function updateVehicle(id, updates) {
    if (isDemo) {
      setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v))
      return
    }
    const { error } = await supabase.from('vehicles').update(updates).eq('id', id)
    if (error) throw error
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v))
  }

  async function deleteVehicle(id) {
    if (isDemo) {
      setVehicles(prev => prev.filter(v => v.id !== id))
      setFuelLogs(prev => prev.filter(f => f.vehicle_id !== id))
      setServiceLogs(prev => prev.filter(s => s.vehicle_id !== id))
      setTrips(prev => prev.filter(t => t.vehicle_id !== id))
      setReminders(prev => prev.filter(r => r.vehicle_id !== id))
      return
    }
    const { error } = await supabase.from('vehicles').delete().eq('id', id)
    if (error) throw error
    setVehicles(prev => prev.filter(v => v.id !== id))
  }

  // Fuel Log CRUD
  async function addFuelLog(log) {
    if (isDemo) {
      const newLog = { ...log, id: `f${Date.now()}`, user_id: user.id }
      setFuelLogs(prev => [newLog, ...prev])
      return newLog
    }
    const { data, error } = await supabase.from('fuel_logs').insert({ ...log, user_id: user.id }).select().single()
    if (error) throw error
    setFuelLogs(prev => [data, ...prev])
    return data
  }

  async function deleteFuelLog(id) {
    if (isDemo) {
      setFuelLogs(prev => prev.filter(f => f.id !== id))
      return
    }
    const { error } = await supabase.from('fuel_logs').delete().eq('id', id)
    if (error) throw error
    setFuelLogs(prev => prev.filter(f => f.id !== id))
  }

  // Service Log CRUD
  async function addServiceLog(log) {
    if (isDemo) {
      const newLog = { ...log, id: `s${Date.now()}`, user_id: user.id }
      setServiceLogs(prev => [newLog, ...prev])
      return newLog
    }
    const { data, error } = await supabase.from('service_logs').insert({ ...log, user_id: user.id }).select().single()
    if (error) throw error
    setServiceLogs(prev => [data, ...prev])
    return data
  }

  // Trip CRUD
  async function addTrip(trip) {
    if (isDemo) {
      const newTrip = { ...trip, id: `t${Date.now()}`, user_id: user.id, distance: trip.end_km - trip.start_km }
      setTrips(prev => [newTrip, ...prev])
      return newTrip
    }
    const { data, error } = await supabase.from('trips').insert({ ...trip, user_id: user.id }).select().single()
    if (error) throw error
    setTrips(prev => [data, ...prev])
    return data
  }

  // Reminder CRUD
  async function updateReminder(id, updates) {
    if (isDemo) {
      setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
      return
    }
    const { error } = await supabase.from('reminders').update(updates).eq('id', id)
    if (error) throw error
    setReminders(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r))
  }

  // Computed values
  const totalFuelCostThisMonth = fuelLogs
    .filter(f => {
      const d = new Date(f.date)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, f) => sum + (f.total_cost || 0), 0)

  const avgMileage = fuelLogs.length > 0
    ? (fuelLogs.reduce((sum, f) => sum + (f.mileage || 0), 0) / fuelLogs.filter(f => f.mileage).length).toFixed(1)
    : '0'

  function getVehicleFuelLogs(vehicleId) {
    return fuelLogs.filter(f => f.vehicle_id === vehicleId)
  }
  function getVehicleServiceLogs(vehicleId) {
    return serviceLogs.filter(s => s.vehicle_id === vehicleId)
  }
  function getVehicleTrips(vehicleId) {
    return trips.filter(t => t.vehicle_id === vehicleId)
  }
  function getVehicleReminders(vehicleId) {
    return reminders.filter(r => r.vehicle_id === vehicleId)
  }

  return (
    <DataContext.Provider value={{
      vehicles, fuelLogs, serviceLogs, trips, reminders, recentActivity,
      loading, loadData,
      addVehicle, updateVehicle, deleteVehicle,
      addFuelLog, deleteFuelLog,
      addServiceLog,
      addTrip,
      updateReminder,
      totalFuelCostThisMonth, avgMileage,
      getVehicleFuelLogs, getVehicleServiceLogs, getVehicleTrips, getVehicleReminders,
    }}>
      {children}
    </DataContext.Provider>
  )
}
