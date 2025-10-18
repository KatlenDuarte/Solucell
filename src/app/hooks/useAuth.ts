
import { useState, useEffect } from 'react'
import { lumi } from '../lib/lumi'

interface User {
  projectId: string
  userId: string
  email: string
  userName: string
  userRole: 'ADMIN' | 'USER'
  createdTime: string
  accessToken: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => (lumi.auth.user as unknown as User | null) ?? null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check existing session
    const checkSession = () => {
      const existingUser = lumi.auth.user
      const isLoggedIn = lumi.auth.isAuthenticated

      if (isLoggedIn && existingUser) {
        setUser(existingUser as unknown as User)
      }
    }

    checkSession()

    // Listen to state changes
    const unsubscribe = lumi.auth.onAuthChange((authUser) => {
      setUser(authUser as unknown as User)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async () => {
    try {
      setLoading(true)
      await lumi.auth.signIn()
    } catch (error) {
      console.error('Login failed:', error)
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await lumi.auth.signOut()
    } catch (error) {
      console.error('Logout failed:', error)
      setLoading(false)
    }
  }

  return {
    user,
    isAuthenticated: !!user,
    userRole: user?.userRole,
    loading,
    signIn,
    signOut
  }
}
