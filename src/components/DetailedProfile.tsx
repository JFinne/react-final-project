import type { RaiderCharacterProfile } from '../types/raider'
import ProfileSummary from './ProfileSummary'

// Try to derive an icon URL from common Raider.IO/blizzard item fields.
// Returns a URL string or null. It prefers absolute URLs found in the payload,
// then attempts sensible CDN fallbacks when only an icon name is provided.
function deriveIconUrl(item: any): string | null {
  if (!item) return null
  const candidates = [
    item.icon_url,
    item.icon,
    item.item_icon,
    item.media?.icon_url,
    item.media?.assets?.[0]?.value,
    item.media?.assets?.find?.((a: any) => a.type === 'icon')?.value,
  ]

  for (const c of candidates) {
    if (!c) continue
    if (typeof c !== 'string') continue
    if (c.startsWith('http')) return c
    if (c.startsWith('/')) return 'https://cdn.raiderio.net' + c
    // if it's a bare icon name (e.g. "inv_sword_01" or "ability_mage_fireblast.png") try common CDNs
    const name = c.replace(/\.(png|jpg)$/i, '')
    // Blizzard render CDN (56px)
    return `https://render-us.worldofwarcraft.com/icons/56/${name}.jpg`
  }
  return null
}

function formatMs(ms: number | undefined): string {
  if (!ms || ms <= 0) return "—"

  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)

  // zero-pad seconds to 2 digits, millis to 3 digits
  const s = String(seconds).padStart(2, "0")

  return `${minutes}:${s}`
}

function RunsList({ runs }: { runs?: any[] }) {
  if (!runs || runs.length === 0) return <div>No runs available</div>
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {runs.map((r, i) => (
        <li key={i} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ fontWeight: 600 }}>{r.dungeon}</div>
          <div style={{ fontSize: 12, color: '#9aa3b2' }}>{'+' + r.mythic_level} • {r.num_keystone_upgrades + '☆'} • {formatMs(r.clear_time_ms)} / {formatMs(r.par_time_ms)} • {r.score}</div>
          <div style={{fontSize: 10, color: '#9aa3b2' }}>{'#' + r.keystone_run_id}</div>
        </li>
      ))}
    </ul>
  )
}

export default function DetailedProfile({ profile }: { profile: RaiderCharacterProfile }) {
  const recent = (profile as any).mythic_plus_recent_runs || []
  const best = (profile as any).mythic_plus_best_runs || []

  return (
    <div className="detailed-profile-grid" style={{ marginTop: 8 }}>
      <aside style={{ border: '1px solid rgba(255,255,255,0.03)', padding: 8, borderRadius: 8 }}>
        <h3 style={{ marginTop: 0 }}>Recent Runs</h3>
        <RunsList runs={recent} />
      </aside>

      <main className="detailed-profile-main" style={{ border: '1px solid rgba(255,255,255,0.03)', padding: 8, borderRadius: 8 }}>
        <section style={{ marginTop: 0}}>
          <h3 style={{textAlign: 'center'}}>Gear</h3>
          {(() => {
            const raw = (profile as any).gear?.items ?? (profile as any).gear
            if (Array.isArray(raw)) {
              /* raw item data is available if you want to map icons later */
            } else if (raw && typeof raw === 'object') {
              /* raw is an object map; we'll ignore detailed item objects for now */
            }

            const leftSlots = ['Helm', 'Neck', 'Shoulders', 'Back', 'Chest', 'Wrists', 'Hands']
            const rightSlots = ['Waist', 'Legs', 'Feet', 'Ring 1', 'Ring 2', 'Trinket 1', 'Trinket 2']
            const bottomSlots = ['Main-Hand', 'Off-Hand']

            // normalize raw into an array of items (preserve key when available)
            let items: any[] = []
            if (Array.isArray(raw)) items = raw
            else if (raw && typeof raw === 'object') {
              items = Object.keys(raw).map((k) => {
                const v = raw[k]
                if (v && typeof v === 'object') return { slot: v.slot ?? k, name: v.name ?? v.item_name ?? k, ...v }
                return { slot: k, name: String(v) }
              })
            }

            // build a lookup of normalized slot keys -> item
            const slotLookup: Record<string, any> = {}
            function normalizeSlotString(s: string) {
              if (!s) return null
              s = s.toLowerCase()
              if (s.includes('head')) return 'head'
              if (s.includes('neck')) return 'neck'
              if (s.includes('shoulder')) return 'shoulder'
              if (s.includes('back')) return 'back'
              if (s.includes('chest')) return 'chest'
              if (s.includes('wrist')) return 'wrist'
              if (s.includes('hands')) return 'hands'
              if (s.includes('waist')) return 'waist'
              if (s.includes('legs')) return 'legs'
              if (s.includes('feet')) return 'feet'
              if (s.includes('finger1')) return 'finger1'
              if (s.includes('finger2')) return 'finger2'
              if (s.includes('trinket1')) return 'trinket1'
              if (s.includes('trinket2')) return 'trinket2'
              if (s.includes('mainhand')) return 'mainhand'
              if (s.includes('offhand')) return 'offhand'
              return null
            }

            for (const it of items) {
              const candidate = (it.slot || it.slotName || it.slot_label || it.__key || it.slot_type || '') as string
              const norm = normalizeSlotString(String(candidate || it.slot || it.name || ''))
              if (norm) {
                if (!slotLookup[norm]) slotLookup[norm] = it
                else {
                  // if duplicate, push into array (for rings/trinkets)
                  if (!Array.isArray(slotLookup[norm])) slotLookup[norm] = [slotLookup[norm]]
                  slotLookup[norm].push(it)
                }
              }
            }

            const displayToKey: Record<string, string> = {
              'Helm': 'head',
              'Neck': 'neck',
              'Shoulders': 'shoulder',
              'Back': 'back',
              'Chest': 'chest',
              'Wrists': 'wrist',
              'Hands': 'hands',
              'Waist': 'waist',
              'Legs': 'legs',
              'Feet': 'feet',
              'Ring 1': 'finger1',
              'Ring 2': 'finger2',
              'Trinket 1': 'trinket1',
              'Trinket 2': 'trinket2',
              'Main-Hand': 'mainhand',
              'Off-Hand': 'offhand'
            }

            return (
              <div className="character-frame" style={{ marginTop: 72}}>
                <div className="gear-col left" style={{ marginTop: 0}}>
                  {leftSlots.map((s) => {
                    const key = displayToKey[s]
                    const it = slotLookup[key]
                    const item = Array.isArray(it) ? it[0] : it
                    const icon = item ? deriveIconUrl(item) : null
                    const title = item?.name || s
                    const ilvl = item?.item_level ?? item?.ilvl ?? '—'

                    return (
                      <div 
                        key={s} 
                        className="gear-slot" 
                        title={title} 
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        {icon ? <img src={icon} alt={title} style={{ width: 32, height: 32 }} /> : <span>{s}</span>}
                        <span style={{ fontSize: 12, color: '#9aa3b2' }}>{ilvl}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="character-center">
                  <ProfileSummary profile={profile} mode="stacked" />
                </div>

                <div className="gear-col right">
                  {rightSlots.map((s) => {
                    const key = displayToKey[s]
                    const it = slotLookup[key]
                    const item = Array.isArray(it) ? it[0] : it
                    const icon = item ? deriveIconUrl(item) : null
                    const title = item?.name || s
                    const ilvl = item?.item_level ?? item?.ilvl ?? '—'

                    return (
                      <div 
                        key={s} 
                        className="gear-slot" 
                        title={title} 
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                      >
                        <span style={{ fontSize: 12, color: '#9aa3b2' }}>{ilvl}</span>
                        {icon ? <img src={icon} alt={title} style={{ width: 32, height: 32 }} /> : <span>{s}</span>}
                      </div>
                    )
                  })}
                </div>

                <div className="gear-bottom" style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  {bottomSlots.map((s) => {
                    const key = displayToKey[s]
                    const it = slotLookup[key]
                    const item = Array.isArray(it) ? it[0] : it
                    const icon = item ? deriveIconUrl(item) : null
                    const title = item?.name || s
                    const ilvl = item?.item_level ?? item?.ilvl ?? '—'

                    return (
                      <div 
                        key={s} 
                        className="gear-slot" 
                        title={title} 
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                      >
                        <span style={{ fontSize: 12, color: '#9aa3b2' }}>{ilvl}</span>
                        {icon ? <img src={icon} alt={title} style={{ width: 32, height: 32 }} /> : <span>{s}</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </section>
      </main>

      <aside style={{ border: '1px solid rgba(255,255,255,0.03)', padding: 8, borderRadius: 8 }}>
        <h3 style={{ marginTop: 0 }}>Top Runs (Season)</h3>
        <RunsList runs={best} />
      </aside>
    </div>
    
  )
}
