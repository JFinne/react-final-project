import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import About from './pages/About'
import CharacterSearch from './pages/CharacterSearch'
import FavoritesPage from './pages/Favorites'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
      children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'character-search', element: <CharacterSearch /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

export default router
