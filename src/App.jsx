import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import BottomNav from './components/BottomNav'

// Pages
import SplashScreen from './pages/SplashScreen'
import LoginScreen from './pages/LoginScreen'
import SignupScreen from './pages/SignupScreen'
import HomeScreen from './pages/HomeScreen'
import VehicleListScreen from './pages/VehicleListScreen'
import VehicleDetailScreen from './pages/VehicleDetailScreen'
import AddVehicleScreen from './pages/AddVehicleScreen'
import AddScreen from './pages/AddScreen'
import AddFuelScreen from './pages/AddFuelScreen'
import AddServiceScreen from './pages/AddServiceScreen'
import AddTripScreen from './pages/AddTripScreen'
import RemindersScreen from './pages/RemindersScreen'
import ProfileScreen from './pages/ProfileScreen'
import EditProfileScreen from './pages/EditProfileScreen'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <span className="text-sm text-muted">Loading...</span>
        </div>
      </div>
    )
  }
  if (!user) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <div className="max-w-md mx-auto relative bg-dark-bg">
      <Routes>
        {/* Public */}
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <SplashScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />

        {/* Protected */}
        <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
        <Route path="/vehicles" element={<ProtectedRoute><VehicleListScreen /></ProtectedRoute>} />
        <Route path="/vehicle/:id" element={<ProtectedRoute><VehicleDetailScreen /></ProtectedRoute>} />
        <Route path="/add-vehicle" element={<ProtectedRoute><AddVehicleScreen /></ProtectedRoute>} />
        <Route path="/add" element={<ProtectedRoute><AddScreen /></ProtectedRoute>} />
        <Route path="/add-fuel" element={<ProtectedRoute><AddFuelScreen /></ProtectedRoute>} />
        <Route path="/add-service" element={<ProtectedRoute><AddServiceScreen /></ProtectedRoute>} />
        <Route path="/add-trip" element={<ProtectedRoute><AddTripScreen /></ProtectedRoute>} />
        <Route path="/reminders" element={<ProtectedRoute><RemindersScreen /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
        <Route path="/edit-profile" element={<ProtectedRoute><EditProfileScreen /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
