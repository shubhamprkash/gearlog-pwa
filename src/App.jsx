import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { StoreProvider, useStore } from './lib/store'
import BottomNav from './components/BottomNav'
import Splash from './pages/Splash'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import FuelPage from './pages/FuelPage'
import ServicePage from './pages/ServicePage'
import AddQuick from './pages/AddQuick'
import AddVehicle from './pages/AddVehicle'
import AddFuel from './pages/AddFuel'
import AddService from './pages/AddService'
import AddTrip from './pages/AddTrip'
import Profile from './pages/Profile'

function Guard({ children }) {
  const { user, authLoading } = useStore()
  if (authLoading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="w-10 h-10 rounded-full border-2 border-[#f97316] border-t-transparent animate-spin"/></div>
  if (!user) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { user } = useStore()
  return (
    <div className="max-w-md mx-auto relative bg-[#0f172a]">
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />
        <Route path="/fuel" element={<Guard><FuelPage /></Guard>} />
        <Route path="/service" element={<Guard><ServicePage /></Guard>} />
        <Route path="/add" element={<Guard><AddQuick /></Guard>} />
        <Route path="/add-vehicle" element={<Guard><AddVehicle /></Guard>} />
        <Route path="/add-fuel" element={<Guard><AddFuel /></Guard>} />
        <Route path="/add-service" element={<Guard><AddService /></Guard>} />
        <Route path="/add-trip" element={<Guard><AddTrip /></Guard>} />
        <Route path="/profile" element={<Guard><Profile /></Guard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return <BrowserRouter><StoreProvider><AppRoutes /></StoreProvider></BrowserRouter>
}
