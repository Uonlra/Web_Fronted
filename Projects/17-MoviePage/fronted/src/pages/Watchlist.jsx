import "../css/Favorites.css"
import { useMovieContext } from "../Contexts/MovieContextCore"
import MovieCard from "../components/MovieCard"

function Watchlist() {
    const { watchlist } = useMovieContext()

    if (watchlist.length > 0) {
        return (
            <div className="favorites">
                <h2>Your Watchlist</h2>
                <div className="movies-grid">
                    {watchlist.map((movie) => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="favorites-empty">
            <h2>No Watchlist Movies Yet</h2>
            <p>Movies added from the details page will appear here as your planned-to-watch queue.</p>
        </div>
    )
}

export default Watchlist
