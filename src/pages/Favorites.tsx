import { useState } from 'react'
import DetailedProfile from '../components/DetailedProfile'
import { useFavorites } from '../contexts/FavoritesContext'

export default function FavoritesPage() {
  const { favorites, removeFavorite } = useFavorites()
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null) // track the clicked profile

  if (favorites.length === 0) return (
    <section>
      <h1>Favorites</h1>
      <p>No favorites saved yet.</p>
    </section>
  )

  // If a profile is selected, show DetailedProfile
  if (selectedProfile) {
    return (
      <section>
        <button onClick={() => setSelectedProfile(null)} style={{ marginBottom: 12 }}>
          ← Back
        </button>
        <DetailedProfile profile={selectedProfile} />
      </section>
    )
  }

  return (
    <section>
      <h1>Favorites</h1>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {favorites.map((f) => (
          <div key={f.id} style={{ border: '1px solid rgba(255,255,255,0.06)', padding: 16, borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 250}}>
              <div>
                <div style={{ fontWeight: 700 }}>{f.profile.name}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{f.profile.realm} • {f.profile.region}</div>
              </div>
              <div>
                <button onClick={() => setSelectedProfile(f.profile)} 
                style={{ fontSize: 12, padding: '8px 16px', textAlign: 'center', borderRadius: 4, cursor: 'pointer', margin: 4}}>
                Details
                </button>

                <button onClick={() => removeFavorite(f.id)} 
                style={{ fontSize: 12, padding: '8px 16px', textAlign: 'center', borderRadius: 4, cursor: 'pointer', margin: 4}}>
                Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
