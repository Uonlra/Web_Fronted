import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getMovieDetails } from "../services/api"
import { useMovieContext } from "../Contexts/MovieContextCore"
import "../css/MovieDetails.css"

const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/w1280"
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500"
const WATCH_STATUS_OPTIONS = [
    { label: "Not Started", value: "not-started" },
    { label: "Watching", value: "watching" },
    { label: "Watched", value: "watched" }
]

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

const createLibraryMovie = (movie) => ({
    ...movie,
    genre_ids: movie.genre_ids || movie.genres?.map((genre) => genre.id) || []
})

export function MovieDetailsSkeleton({ onBack, backLabel = "Back" }) {
    return (
        <section className="movie-details movie-details-loading" aria-label="Loading movie details">
            <div className="movie-details-shell">
                <button className="details-back-link" type="button" onClick={onBack}>
                    <span aria-hidden="true">←</span>
                    {backLabel}
                </button>

                <div className="details-layout">
                    <div className="details-poster details-skeleton-block"></div>
                    <div className="details-copy details-skeleton-copy">
                        <div className="details-skeleton-line is-eyebrow"></div>
                        <div className="details-skeleton-line title"></div>
                        <div className="details-skeleton-line title short"></div>
                        <div className="details-skeleton-line meta"></div>
                        <div className="details-skeleton-tags">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <div className="details-skeleton-line overview"></div>
                        <div className="details-skeleton-line overview wide"></div>
                        <div className="details-skeleton-actions">
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export function DetailsStatus({ title, message, onBack, backLabel = "Back to Movies" }) {
    return (
        <section className="movie-details-status" role="status">
            <p className="details-status-kicker">Movie Details</p>
            <h1>{title}</h1>
            <p>{message}</p>
            <button className="details-action-button" type="button" onClick={onBack}>
                <span aria-hidden="true">←</span>
                {backLabel}
            </button>
        </section>
    )
}

export function MovieDetailsContent({ movieId, onBack, backLabel = "Back" }) {
    const [movie, setMovie] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const {
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        getWatchStatus,
        updateWatchStatus
    } = useMovieContext()

    useEffect(() => {
        let ignoreResult = false

        const loadMovieDetails = async () => {
            setLoading(true)
            setError(null)
            setMovie(null)

            try {
                const movieDetails = await getMovieDetails(movieId)
                if (!ignoreResult) {
                    setMovie(movieDetails)
                }
            } catch (error) {
                if (!ignoreResult) {
                    setError(error.message)
                }
            } finally {
                if (!ignoreResult) {
                    setLoading(false)
                }
            }
        }

        loadMovieDetails()

        return () => {
            ignoreResult = true
        }
    }, [movieId])

    if (loading) {
        return <MovieDetailsSkeleton onBack={onBack} backLabel={backLabel} />
    }

    if (error) {
        return (
            <DetailsStatus
                title="Movie details unavailable"
                message={error}
                onBack={onBack}
                backLabel={backLabel}
            />
        )
    }

    if (!movie) {
        return (
            <DetailsStatus
                title="Movie details unavailable"
                message="TMDB did not return details for this movie."
                onBack={onBack}
                backLabel={backLabel}
            />
        )
    }

    const backdropUrl = movie.backdrop_path ? `${BACKDROP_BASE_URL}${movie.backdrop_path}` : null
    const posterUrl = movie.poster_path ? `${POSTER_BASE_URL}${movie.poster_path}` : null
    const favorite = isFavorite(movie.id)
    const inWatchlist = isInWatchlist(movie.id)
    const watchStatus = getWatchStatus(movie.id)
    const rating = getRating(movie)

    const handleFavoriteClick = () => {
        if (favorite) {
            removeFromFavorites(movie.id)
            return
        }

        addToFavorites(createLibraryMovie(movie))
    }

    const handleWatchlistClick = () => {
        if (inWatchlist) {
            removeFromWatchlist(movie.id)
            return
        }

        addToWatchlist(createLibraryMovie(movie))
    }

    return (
        <section className="movie-details">
            {backdropUrl && (
                <img className="movie-details-backdrop" src={backdropUrl} alt="" aria-hidden="true" />
            )}

            <div className="movie-details-shell">
                <button className="details-back-link" type="button" onClick={onBack}>
                    <span aria-hidden="true">←</span>
                    {backLabel}
                </button>

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
                            <strong>{rating}</strong>
                            {rating !== "Not rated" && <span>/10</span>}
                        </div>

                        <p className="details-overview">
                            {movie.overview || "No overview is available for this movie."}
                        </p>

                        <div className="details-actions">
                            <button
                                className={`details-action-button details-favorite-button ${favorite ? "active" : ""}`}
                                type="button"
                                aria-pressed={favorite}
                                onClick={handleFavoriteClick}
                            >
                                <span aria-hidden="true">{favorite ? "♥" : "♡"}</span>
                                {favorite ? "Favorited" : "Add Favorite"}
                            </button>
                            <button
                                className={`details-action-button details-watchlist-button ${inWatchlist ? "active" : ""}`}
                                type="button"
                                aria-pressed={inWatchlist}
                                onClick={handleWatchlistClick}
                            >
                                <span aria-hidden="true">{inWatchlist ? "✓" : "＋"}</span>
                                {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
                            </button>
                        </div>

                        {inWatchlist && (
                            <label className="details-status-field">
                                <span>Watch status</span>
                                <select
                                    value={watchStatus}
                                    aria-label={`Watch status for ${movie.title}`}
                                    onChange={(event) => updateWatchStatus(movie.id, event.target.value)}
                                >
                                    {WATCH_STATUS_OPTIONS.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

function MovieDetails() {
    const { movieId } = useParams()
    const navigate = useNavigate()

    return (
        <MovieDetailsContent
            movieId={movieId}
            onBack={() => navigate("/movies")}
            backLabel="Back to Movies"
        />
    )
}

export default MovieDetails
