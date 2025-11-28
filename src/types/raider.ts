// Lightweight TypeScript models for Raider.IO responses.
// These are intentionally partial and permissive: fields are optional to
// accommodate endpoint variations. Extend as you need for your app.

export interface Gear {
  item_level?: number
  item_level_equipped?: number
  items?: Array<Record<string, any>>
  [key: string]: any
}

export interface MythicPlusSeasonScore {
  season?: string | number
  scores?: {
    all?: number
    tank?: number
    healer?: number
    dps?: number
    [key: string]: number | undefined
  }
  [key: string]: any
}

export interface RaiderCharacterProfile {
  name: string
  realm: string
  region: string
  class?: string
  race?: string
  faction?: string
  active_spec_name?: string
  role?: string
  level?: number
  thumbnail_url?: string
  gear?: Gear
  mythic_plus_scores_by_season?: MythicPlusSeasonScore[]
  // many endpoints include extra nested data; keep this indexer to allow safe access
  [key: string]: any
}

export type RaiderResponse<T = any> = T | null
