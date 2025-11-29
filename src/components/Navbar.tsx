import { Link } from 'react-router-dom'
import './Navbar.css'
import { useFavorites } from '../contexts/FavoritesContext'

export default function Navbar() {
  const { favorites } = useFavorites()
  return (
    <header className="site-nav">
      <div className="nav-inner">
        <h2 className="brand">Kwooni's Raider.IO App</h2>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/character-search">Character Search</Link></li>
            <li><Link to="/live-leaderboards">Leaderboards</Link></li>
            <li><Link to="/favorites">Favorites ({favorites.length})</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
