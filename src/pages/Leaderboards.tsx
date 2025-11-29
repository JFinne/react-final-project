import { useState } from 'react'
import LiveLeaderboard from "../components/LiveLeaderboard"

export default function Leaderboards() {
  const [dungeon, setDungeon] = useState("all")
  const [region, setRegion] = useState("world")

  return (
    <section>
      <h1>Leaderboards</h1>

      <div style={{ marginBottom: 12 }}>
        <label>
          Region:
          <select value={region} onChange={e => setRegion(e.target.value)}>
            <option value="world">WORLD</option>
            <option value="us">US</option>
            <option value="eu">EU</option>
            <option value="cn">CN</option>
            <option value="kr">KR</option>
            <option value="tw">TW</option>
          </select>
        </label>

        <label style={{ marginLeft: 12 }}>
          Dungeon:
          <select value={dungeon} onChange={e => setDungeon(e.target.value)}>
            <option value="all">All</option>
            <option value="arakara-city-of-echoes">Ara-Kara, City of Echoes</option>
            <option value="ecodome-aldani">Eco-Dome Al'dani</option>
            <option value="halls-of-atonement">Halls of Atonement</option>
            <option value="operation-floodgate">Operation: Floodgate</option>
            <option value="priory-of-the-sacred-flame">Priory of the Sacred Flame</option>
            <option value="tazavesh-soleahs-gambit">Tazavesh: So'leah's Gambit</option>
            <option value="tazavesh-streets-of-wonder">Tazavesh: Streets of Wonder</option>
            <option value="the-dawnbreaker">The Dawnbreaker</option>
          </select>
        </label>
      </div>

      <LiveLeaderboard region={region} dungeon={dungeon} limit={0} />
    </section>
  )
}
