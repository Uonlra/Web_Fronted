
import { Route, Routes } from 'react-router-dom'
import './css/App.css'
import MovieDetailsModal from './components/MovieDetailsModal'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import Movies from './pages/Movies'
import NavBar from './components/NavBar'
import Watchlist from './pages/Watchlist'
import { MovieProvider } from './Contexts/MovieContext'
import { MovieDetailsModalProvider } from './Contexts/MovieDetailsModalProvider'

function App() {

  return (
    <MovieProvider>
      <MovieDetailsModalProvider>
        <div>
          <NavBar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/watchlist" element={<Watchlist />} />
            </Routes>
          </main>
          <MovieDetailsModal />
        </div>
      </MovieDetailsModalProvider>
    </MovieProvider>
  )
}

export default App
