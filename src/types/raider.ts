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

export interface RaiderCharacter {
  name: string
  class: string
  spec: string
  realm: string
  role: string
}

export interface RaiderRosterEntry {
  character: {
    id: number
    persona_id: number
    name: string
    level: number
    race: { id: number; name: string; slug: string }
    realm: { id: number; name: string; slug: string }
    region: { name: string; slug: string; short_name: string }
    path: string
    class: { id: number; name: string; slug: string }
    spec: { id: number; name: string; slug: string }
    isBanned: boolean
    isTransfer: boolean
  }
  role: string
}

export interface RaiderDungeon {
  type: string
  id: number
  name: string
  short_name: string
  slug: string
  expansion_id: number
  icon_url: string
  patch: string
  wowInstanceId: number
  map_challenge_mode_id: number
  num_bosses: number
  group_finder_activity_ids: number[]
}

export interface RaiderRun {
  dungeon: RaiderDungeon
  mythic_level: number
  clear_time_ms: number
  roster: RaiderRosterEntry[]
}

export interface RaiderRunEntry {
  score: number
  run: RaiderRun
}



export type RaiderResponse<T = any> = T | null
