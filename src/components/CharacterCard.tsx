import type { RaiderCharacterProfile } from '../types/raider'

export default function CharacterCard({ profile }: { profile: RaiderCharacterProfile }) {
  return (
    <article style={{ border: '1px solid rgba(255,255,255,0.06)', padding: 12, borderRadius: 8, minWidth: 220 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        {profile.thumbnail_url && <img src={profile.thumbnail_url} alt="thumb" style={{ width: 48, height: 48, borderRadius: 6 }} />}
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 700 }}>{profile.name}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{profile.realm} • {profile.region}</div>
        </div>
      </div>
    </article>
  )
}
