
import { Route, Routes } from 'react-router-dom'
import './css/App.css'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import Movies from './pages/Movies'
import NavBar from './components/NavBar'
import Watchlist from './pages/Watchlist'
import { MovieProvider } from './Contexts/MovieContext'

function App() {

  return (
    <MovieProvider>
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
      </div>
    </MovieProvider>
  )
}

export default App
