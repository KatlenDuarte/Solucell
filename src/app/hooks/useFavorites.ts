
import { useState, useEffect } from 'react'
import { Product } from '../data/products'

export function useFavorites() {
  const [favorites, setFavorites] = useState<Product[]>([])

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const addToFavorites = (product: Product) => {
    setFavorites(currentFavorites => {
      const isAlreadyFavorite = currentFavorites.some(fav => fav.id === product.id)
      if (!isAlreadyFavorite) {
        return [...currentFavorites, product]
      }
      return currentFavorites
    })
  }

  const removeFromFavorites = (productId: string) => {
    setFavorites(currentFavorites => 
      currentFavorites.filter(fav => fav.id !== productId)
    )
  }

  const toggleFavorite = (product: Product) => {
    const isFavorite = favorites.some(fav => fav.id === product.id)
    if (isFavorite) {
      removeFromFavorites(product.id)
    } else {
      addToFavorites(product)
    }
  }

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.id === productId)
  }

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    totalFavorites: favorites.length
  }
}
