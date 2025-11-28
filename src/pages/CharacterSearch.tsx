import { useState } from 'react'
import ProfileSummary from '../components/ProfileSummary'
import DetailedProfile from '../components/DetailedProfile'
import type { RaiderCharacterProfile } from '../types/raider'
import { useFavorites } from '../contexts/FavoritesContext'

export default function CharacterSearch() {
  const [region, setRegion] = useState('us')
  const [realm, setRealm] = useState('illidan')
  const [name, setName] = useState('bondd')
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<RaiderCharacterProfile | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function fetchProfile(e?: React.FormEvent) {
    e?.preventDefault()
    setLoading(true)
    setError(null)
    setProfile(null)
    try {
  const url = `/api/raider/characters/profile?region=${encodeURIComponent(region)}&realm=${encodeURIComponent(realm)}&name=${encodeURIComponent(name)}&fields=gear%2Cmythic_plus_scores_by_season%3Acurrent%2Cguild%2Cmythic_plus_recent_runs%2Cmythic_plus_best_runs%2Ctalents%3Acategorized`
      const res = await fetch(url, { headers: { Accept: 'application/json' } })
      if (!res.ok) throw new Error(res.statusText)
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        const text = await res.text()
        throw new Error('Non-JSON response: ' + text)
      }
      const json = await res.json()
      setProfile(json)
    } catch (err: any) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  const { addFavorite, removeFavorite, isFavorite } = useFavorites()

  const toggleFavorite = (p: RaiderCharacterProfile) => {
    const id = `${p.region}/${p.realm}/${p.name}`
    if (isFavorite(id)) removeFavorite(id)
    else addFavorite({ id, profile: p })
  }
  const [showDetails, setShowDetails] = useState(false)

  return (
    <section>
      <h1>Character Search</h1>

      {/* Search controls pinned higher on the page */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
        <form onSubmit={fetchProfile} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="region" />
          <input value={realm} onChange={(e) => setRealm(e.target.value)} placeholder="realm" />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" />
          <button type="submit">Search</button>
        </form>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'var(--error, #ff6b6b)' }}>Error: {error}</p>}

      {/* Character blurb shown inline beneath the inputs */}
      {profile && (
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <ProfileSummary profile={profile} />
            <div style={{ marginLeft: 16 }}>
              <button onClick={() => toggleFavorite(profile)} style={{ marginBottom: 8 }}>
                {isFavorite(`${profile.region}/${profile.realm}/${profile.name}`) ? 'Unfavorite' : 'Add Favorite'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={() => setShowDetails((s) => !s)}>{showDetails ? 'Hide Details' : 'Show Details'}</button>
            <details style={{ marginTop: 0 }}>
              <summary style={{ cursor: 'pointer' }}>Raw JSON</summary>
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>{JSON.stringify(profile, null, 2)}</pre>
            </details>
          </div>
          {showDetails && <DetailedProfile profile={profile} />}
        </div>
      )}
    </section>
  )
}
