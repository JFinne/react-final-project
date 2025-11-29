import { useState, useEffect } from 'react'
import type { RaiderRunEntry } from '../types/raider'

interface LiveLeaderboardProps {
  region?: string
  dungeon: string
  limit?: number
}

const CLASS_COLORS: Record<string, string> = {
  "Death Knight": "#C41F3B",
  "Demon Hunter": "#A330C9",
  Druid: "#FF7D0A",
  Hunter: "#ABD473",
  Mage: "#69CCF0",
  Monk: "#00FF96",
  Paladin: "#F58CBA",
  Priest: "#FFFFFF",
  Rogue: "#FFF569",
  Shaman: "#0070DE",
  Warlock: "#9482C9",
  Warrior: "#C79C6E"
}


export default function LiveLeaderboard({
  region = 'us',
  dungeon,
  limit = 0,
}: LiveLeaderboardProps) {
  const [runs, setRuns] = useState<RaiderRunEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


  async function fetchRuns() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        region,
        dungeon,
        page: String(limit),
      })

      console.log(`https://raider.io/api/v1/mythic-plus/runs?season=season-tww-3&${params.toString()}`)

      const res = await fetch(`https://raider.io/api/v1/mythic-plus/runs?season=season-tww-3&${params.toString()}`, {
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(res.statusText)
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        const text = await res.text()
        throw new Error('Non-JSON response: ' + text)
      }
      const json = await res.json()
      console.log(json.rankings)
      setRuns(json.rankings || [])
    } catch (err: any) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
    
  }

  useEffect(() => {
    fetchRuns()
  }, [region, dungeon, limit])

  if (loading) return <p>Loading leaderboard...</p>
  if (error) return <p style={{ color: 'var(--error, #ff6b6b)' }}>Error: {error}</p>
  if (!runs.length) return <p>No runs found.</p>
  
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#222222' }}>
            <th style={thStyle}>Rank</th>
            <th style={thStyle}>Dungeon</th>
            <th style={thStyle}>M+ Level</th>
            <th style={thStyle}>Run Time</th>
            <th style={thStyle}>Score</th>
            <th style={thStyle}>Players</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((entry, runIndex) => (
            <tr key={runIndex}>
              <td>{runIndex + 1}</td>
              <td>{entry.run.dungeon.name}</td>
              <td>{entry.run.mythic_level}</td>
              <td>{msToMinutesSeconds(entry.run.clear_time_ms)}</td>
              <td>{entry.score}</td>
              <td>
                {entry.run.roster
                  ?.map(player => {
                    const charName = player.character?.name
                    const charRealm = player.character.realm.name 
                    const charRegion = (player.character.region.slug).toUpperCase()
                    const color = CLASS_COLORS[player.character.class.name] || "#FFF"
                    return (
                      <span key={player.character.id} style={{ color }}>
                        {charName} ({charRealm} - {charRegion})
                      </span>
                    )
                  })
                  .reduce<React.ReactNode[]>((prev, curr) => prev.length === 0 ? [curr] : [...prev, ', ', curr], [])}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const thStyle: React.CSSProperties = { padding: '4px 8px', border: '1px solid #ccc' }

function msToMinutesSeconds(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
