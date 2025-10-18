"use client"
import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import { useFavorites } from '../hooks/useFavorites'

interface AppContextType {
  auth: ReturnType<typeof useAuth>
  cart: ReturnType<typeof useCart>
  favorites: ReturnType<typeof useFavorites>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  const cart = useCart()
  const favorites = useFavorites()

  return (
    <AppContext.Provider value={{ auth, cart, favorites }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
