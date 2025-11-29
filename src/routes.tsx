import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import CharacterSearch from './pages/CharacterSearch'
import Leaderboards from './pages/Leaderboards'
import FavoritesPage from './pages/Favorites'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
      children: [
      { index: true, element: <Home /> },
      { path: 'character-search', element: <CharacterSearch /> },
      { path: 'live-leaderboards', element: <Leaderboards /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default router
