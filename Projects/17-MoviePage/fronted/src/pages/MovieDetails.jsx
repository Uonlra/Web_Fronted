import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { getMovieDetails } from "../services/api"
import { useMovieContext } from "../Contexts/MovieContextCore"
import "../css/MovieDetails.css"

const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280"
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500"

const getReleaseYear = (movie) => movie?.release_date?.split("-")[0] || "Unknown"

const getRuntime = (runtime) => {
    if (!runtime) return "Runtime unknown"

    const hours = Math.floor(runtime / 60)
    const minutes = runtime % 60

    if (!hours) return `${minutes}m`

    return `${hours}h ${minutes}m`
}

const getRating = (movie) => {
    const rating = Number(movie?.vote_average || 0)
    return rating ? rating.toFixed(1) : "Not rated"
}

function MovieDetails() {
    const { movieId } = useParams()
    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useMovieContext()

    useEffect(() => {
        const loadMovieDetails = async () => {
            try {
                setError(null)
                const movieDetails = await getMovieDetails(movieId)
                setMovie(movieDetails)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadMovieDetails()
    }, [movieId])

    if (loading) {
        return <div className="movie-details-status">Loading movie details...</div>
    }

    if (error) {
        return <div className="movie-details-status error-message">{error}</div>
    }

    if (!movie) {
        return <div className="movie-details-status">Movie details unavailable.</div>
    }

    const backdropUrl = movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null
    const posterUrl = movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : null
    const inWatchlist = isInWatchlist(movie.id)

    const handleWatchlistClick = () => {
        if (inWatchlist) {
            removeFromWatchlist(movie.id)
            return
        }

        addToWatchlist(movie)
    }

    return (
        <section className="movie-details">
            {backdropUrl && (
                <img className="movie-details-backdrop" src={backdropUrl} alt="" aria-hidden="true" />
            )}

            <div className="movie-details-shell">
                <Link className="details-back-link" to="/">
                    ← Back Home
                </Link>

                <div className="details-layout">
                    <div className="details-poster">
                        {posterUrl ? (
                            <img src={posterUrl} alt={movie.title} />
                        ) : (
                            <div className="details-poster-placeholder">No poster</div>
                        )}
                    </div>

                    <div className="details-copy">
                        <p className="details-eyebrow">Movie Details</p>
                        <h1>{movie.title}</h1>
                        {movie.tagline && <p className="details-tagline">{movie.tagline}</p>}

                        <div className="details-meta">
                            <span>{getReleaseYear(movie)}</span>
                            <span>{getRuntime(movie.runtime)}</span>
                            <span>{movie.original_language?.toUpperCase()}</span>
                        </div>

                        <div className="details-genres">
                            {movie.genres?.slice(0, 4).map((genre) => (
                                <span key={genre.id}>{genre.name}</span>
                            ))}
                        </div>

                        <div className="details-rating">
                            <span>★</span>
                            <strong>{getRating(movie)}</strong>
                            <span>/10</span>
                        </div>

                        <p className="details-overview">
                            {movie.overview || "No overview is available for this movie."}
                        </p>

                        <div className="details-actions">
                            <button className="details-play-button" type="button">
                                <span aria-hidden="true">▶</span>
                                Play
                            </button>
                            <button
                                className={`details-watchlist-button ${inWatchlist ? "active" : ""}`}
                                type="button"
                                aria-pressed={inWatchlist}
                                onClick={handleWatchlistClick}
                            >
                                <span aria-hidden="true">{inWatchlist ? "✓" : "＋"}</span>
                                {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MovieDetails
