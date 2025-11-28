import type { RaiderCharacterProfile } from '../types/raider'
import { useFavorites } from '../contexts/FavoritesContext'
import ProfileSummary from './ProfileSummary'

export default function CharacterModal({ profile, onClose }: { profile: RaiderCharacterProfile; onClose: () => void }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const id = `${profile.region}/${profile.realm}/${profile.name}`
  const favorite = isFavorite(id)

  function toggleFavorite() {
    if (favorite) removeFavorite(id)
    else addFavorite({ id, profile })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)' }}>
      <div style={{ background: 'var(--card-bg, #111)', padding: 20, borderRadius: 8, width: 'min(900px, 96%)', maxHeight: '90vh', overflow: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0 }}>{profile.name} — {profile.realm}</h2>
          <div>
            <button onClick={toggleFavorite} style={{ marginRight: 8 }}>{favorite ? 'Unfavorite' : 'Add Favorite'}</button>
            <button onClick={onClose}>Close</button>
          </div>
        </header>
        <section style={{ marginTop: 12 }}>
          <ProfileSummary profile={profile} />
        </section>
        <section style={{ marginTop: 12 }}>
          <details>
            <summary style={{ cursor: 'pointer' }}>Raw JSON</summary>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>{JSON.stringify(profile, null, 2)}</pre>
          </details>
        </section>
      </div>
    </div>
  )
}
