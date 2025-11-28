import type { RaiderCharacterProfile } from '../types/raider'

function formatNumber(n?: number | null) {
  if (n == null) return '—'
  return Math.round(n).toString()
}

export default function ProfileSummary({ profile, mode = 'inline' }: { profile: RaiderCharacterProfile; mode?: 'inline' | 'stacked' }) {
  // extract values defensively
  const name = profile.name || 'Unknown'
  const realm = profile.realm || profile['server'] || 'Unknown'
  const region = profile.region || 'Unknown'
  const guild = profile.guild?.name || profile.guild_name || profile.guild || '—'
  const klass = profile.class || profile.class_name || profile.character_class || '—'
  const spec = profile.active_spec_name || profile.spec || '—'
  const race = profile.race || profile.race_name || profile.character_race || '—'

  const ilvl = profile.gear?.item_level_equipped ?? profile.gear?.item_level ?? null

  // find a reasonable mythic+ score value: try mythic_plus_scores_by_season (current) or top-level field
  let mplus: number | null = null
  try {
    const bySeason = profile.mythic_plus_scores_by_season
    if (Array.isArray(bySeason) && bySeason.length > 0) {
      // look for an entry with season containing 'current' or take first
      const current = bySeason.find((s: any) => String(s.season).toLowerCase().includes('current')) || bySeason[0]
      mplus = current?.scores?.all ?? null
    }
    if (mplus == null && (profile as any).mythic_plus_scores) {
      // some payloads include a direct score
      const maybe = (profile as any).mythic_plus_scores
      if (typeof maybe === 'number') mplus = maybe
      else if (maybe?.all) mplus = maybe.all
    }
  } catch (err) {
    mplus = null
  }

  if (mode === 'stacked') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        {profile.thumbnail_url && (
          <img src={profile.thumbnail_url} alt="avatar" style={{ width: 120, height: 120, borderRadius: 12, objectFit: 'cover' }} />
        )}
        <div style={{ width: '100%', maxWidth: 520 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0 }}>{name}</h2>
            <div style={{ color: '#9aa3b2' }}>{realm} • {region}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 8 }}>
            <div style={{ flex: 1, textAlign: 'left' }}><strong>Guild:</strong> {typeof guild === 'string' ? guild : JSON.stringify(guild)}</div>
            <div style={{ flex: 1, textAlign: 'center' }}><strong>Class:</strong> {klass}</div>
            <div style={{ flex: 1, textAlign: 'right' }}><strong>Spec:</strong> {spec}</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 6 }}>
            <div style={{ flex: 1, textAlign: 'left' }}><strong>Race:</strong> {race}</div>
            <div style={{ flex: 1, textAlign: 'center' }}><strong>iLvl:</strong> {formatNumber(ilvl)}</div>
            <div style={{ flex: 1, textAlign: 'right' }}><strong>M+:</strong> {mplus == null ? '—' : Math.round(mplus)}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {profile.thumbnail_url && (
        <img src={profile.thumbnail_url} alt="avatar" style={{ width: 96, height: 96, borderRadius: 8, objectFit: 'cover' }} />
      )}
      <div style={{ textAlign: 'left' }}>
        <h2 style={{ margin: '0 0 6px 0' }}>{name}</h2>
        <div style={{ color: '#9aa3b2', marginBottom: 8 }}>{realm} • {region}</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
          <div><strong>Guild:</strong> {typeof guild === 'string' ? guild : JSON.stringify(guild)}</div>
          <div><strong>Class:</strong> {klass}</div>
          <div><strong>Spec:</strong> {spec}</div>
          <div><strong>Race:</strong> {race}</div>
        </div>
        <div style={{ display: 'flex', gap: 12, color: '#cbd5e1' }}>
          <div><strong>iLvl:</strong> {formatNumber(ilvl)}</div>
          <div><strong>M+ Score:</strong> {mplus == null ? '—' : Math.round(mplus)}</div>
        </div>
      </div>
    </div>
  )
}
