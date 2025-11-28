import React, { createContext, useContext, useEffect, useState } from 'react'
import type { RaiderCharacterProfile } from '../types/raider'

type FavoriteEntry = {
  id: string // unique key, e.g., `${region}/${realm}/${name}`
  profile: RaiderCharacterProfile
}

type FavoritesContextType = {
  favorites: FavoriteEntry[]
  addFavorite: (entry: FavoriteEntry) => boolean
  removeFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const STORAGE_KEY = 'raider_favorites'
const MAX_FAVORITES = 20

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setFavorites(JSON.parse(raw))
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // ignore
    }
  }, [favorites])

  function addFavorite(entry: FavoriteEntry) {
    if (favorites.find((f) => f.id === entry.id)) return true
    if (favorites.length >= MAX_FAVORITES) return false
    setFavorites((s) => [entry, ...s])
    return true
  }

  function removeFavorite(id: string) {
    setFavorites((s) => s.filter((f) => f.id !== id))
  }

  function isFavorite(id: string) {
    return favorites.some((f) => f.id === id)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider')
  return ctx
}
