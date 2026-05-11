import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { demoUser } from '../lib/demoData'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    checkUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
        setIsDemo(false)
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    })
    return () => subscription?.unsubscribe()
  }, [])

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
        await fetchProfile(session.user.id)
        setIsDemo(false)
      }
    } catch (e) {
      console.log('Auth check failed, using demo mode')
    }
    setLoading(false)
  }

  async function fetchProfile(userId) {
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (data) setProfile(data)
    } catch (e) {
      console.log('Profile fetch failed')
    }
  }

  async function signUp(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })
    if (error) throw error
    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) throw error
    return data
  }

  async function signOut() {
    if (isDemo) {
      setUser(null)
      setProfile(null)
      setIsDemo(false)
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  function loginAsDemo() {
    setUser(demoUser)
    setProfile({ full_name: demoUser.full_name, notify_service: true, notify_expiry: true, notify_daily_summary: false })
    setIsDemo(true)
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading, isDemo,
      signUp, signIn, signInWithGoogle, signOut, loginAsDemo, resetPassword, fetchProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}
