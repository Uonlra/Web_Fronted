import "../css/MovieCard.css"
import { useMovieContext } from "../Contexts/MovieContextCore"

function MovieCard({movie}) {
    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext()
    const favorite = isFavorite(movie.id)
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null
    const releaseYear = movie.release_date?.split("-")[0] || "Unknown"

    function onFavoriteClick(e) {
        e.preventDefault()
        if (favorite) removeFromFavorites(movie.id)
        else addToFavorites(movie)
    }

    return <div className="movie-card">
        <div className="movie-poster">
            {posterUrl ? (
                <img src={posterUrl} alt={movie.title}/>
            ) : (
                <div className="movie-poster-placeholder">No poster</div>
            )}
            <div className="movie-overlay">
                <button type="button" className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavoriteClick}>
                    ❤️
                </button>
            </div>
        </div>
        <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>{releaseYear}</p>
        </div>
    </div>
}

export default MovieCard
