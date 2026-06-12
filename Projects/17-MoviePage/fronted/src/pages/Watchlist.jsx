import { useMemo, useState } from "react"
import SortDropdown from "../components/SortDropdown"
import { useMovieDetailsModal } from "../Contexts/MovieDetailsModalContext"
import { useMovieContext } from "../Contexts/MovieContextCore"
import { getMovieImage, getRating, getReleaseYear } from "../utils/movieFormatters"
import "../css/Movies.css"
import "../css/Watchlist.css"

const WATCH_STATUS_OPTIONS = [
    { label: "All", value: "all" },
    { label: "Not Started", value: "not-started" },
    { label: "Watching", value: "watching" },
    { label: "Watched", value: "watched" }
]

const WATCH_SORT_OPTIONS = [
    { label: "Rating", value: "rating" },
    { label: "Release Year", value: "year" },
    { label: "Title", value: "title" }
]

const GENRE_NAMES = {
    12: "Adventure",
    14: "Fantasy",
    16: "Animation",
    18: "Drama",
    27: "Horror",
    28: "Action",
    35: "Comedy",
    36: "History",
    37: "Western",
    53: "Thriller",
    80: "Crime",
    99: "Documentary",
    878: "Sci-Fi",
    9648: "Mystery",
    10402: "Music",
    10749: "Romance",
    10751: "Family",
    10752: "War",
    10770: "TV Movie"
}

const STATUS_LABELS = {
    "not-started": "Not Started",
    watching: "Watching",
    watched: "Watched"
}

const NEXT_STATUS = {
    "not-started": "watching",
    watching: "watched",
    watched: "watching"
}

const ACTION_LABELS = {
    "not-started": "Start",
    watching: "Mark Watched",
    watched: "Rewatch"
}

const getReleaseYearNumber = (movie) => {
    return Number(movie?.release_date?.split("-")[0] || 0)
}

const getMovieGenres = (movie) => {
    return movie.genre_ids
        ?.map((genreId) => GENRE_NAMES[genreId])
        .filter(Boolean)
        .slice(0, 2)
        .join(", ") || "Cinema"
}

const sortWatchlistMovies = (movies, sortValue) => {
    return [...movies].sort((firstMovie, secondMovie) => {
        if (sortValue === "year") {
            return getReleaseYearNumber(secondMovie) - getReleaseYearNumber(firstMovie)
        }

        if (sortValue === "title") {
            return (firstMovie.title || "").localeCompare(secondMovie.title || "")
        }

        return Number(secondMovie.vote_average || 0) - Number(firstMovie.vote_average || 0)
    })
}

function WatchlistRow({
    movie,
    index,
    status,
    onAdvanceStatus,
    onStatusChange,
    onRemove
}) {
    const { openMovieDetails } = useMovieDetailsModal()
    const imageUrl = getMovieImage(movie)

    return (
        <article className="watchlist-row">
            <button
                type="button"
                className="watchlist-row-link"
                aria-label={`View details for ${movie.title}`}
                onClick={() => openMovieDetails(movie.id)}
            />
            <div className="watchlist-rank">{index + 1}</div>
            <div className="watchlist-thumb">
                {imageUrl ? (
                    <img src={imageUrl} alt={movie.title} />
                ) : (
                    <div className="watchlist-thumb-placeholder">No image</div>
                )}
            </div>
            <div className="watchlist-main">
                <h2>{movie.title}</h2>
                <p>
                    <span>{getReleaseYear(movie)}</span>
                    <span aria-hidden="true">•</span>
                    <span className="watchlist-star" aria-hidden="true">★</span>
                    <span>{getRating(movie)}</span>
                    <span aria-hidden="true">•</span>
                    <span>{getMovieGenres(movie)}</span>
                </p>
            </div>
            <div className="watchlist-status">
                <select
                    className={`watch-status-select ${status}`}
                    value={status}
                    aria-label={`Watch status for ${movie.title}`}
                    onChange={(event) => onStatusChange(movie.id, event.target.value)}
                >
                    {WATCH_STATUS_OPTIONS.filter((option) => option.value !== "all").map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <span>{STATUS_LABELS[status]}</span>
            </div>
            <button
                type="button"
                className={`watchlist-action ${status}`}
                onClick={() => onAdvanceStatus(movie.id, status)}
            >
                <span aria-hidden="true">{status === "watched" ? "↻" : "▶"}</span>
                {ACTION_LABELS[status]}
            </button>
            <button
                type="button"
                className="watchlist-remove-action"
                aria-label={`Remove ${movie.title} from watchlist`}
                onClick={() => onRemove(movie.id)}
            >
                ×
            </button>
        </article>
    )
}

function Watchlist() {
    const {
        watchlist,
        getWatchStatus,
        updateWatchStatus,
        removeFromWatchlist
    } = useMovieContext()
    const [searchValue, setSearchValue] = useState("")
    const [activeStatus, setActiveStatus] = useState("all")
    const [sortValue, setSortValue] = useState("rating")
    const statusCounts = useMemo(() => {
        return watchlist.reduce((counts, movie) => {
            const status = getWatchStatus(movie.id)
            return {
                ...counts,
                [status]: counts[status] + 1
            }
        }, {
            "not-started": 0,
            watching: 0,
            watched: 0
        })
    }, [getWatchStatus, watchlist])
    const visibleMovies = useMemo(() => {
        const normalizedSearch = searchValue.trim().toLowerCase()
        const filteredMovies = watchlist.filter((movie) => {
            const matchesSearch = normalizedSearch
                ? movie.title?.toLowerCase().includes(normalizedSearch)
                : true
            const matchesStatus = activeStatus === "all" || getWatchStatus(movie.id) === activeStatus

            return matchesSearch && matchesStatus
        })

        return sortWatchlistMovies(filteredMovies, sortValue)
    }, [activeStatus, getWatchStatus, searchValue, sortValue, watchlist])

    const handleAdvanceStatus = (movieId, currentStatus) => {
        updateWatchStatus(movieId, NEXT_STATUS[currentStatus])
    }

    return (
        <section className="watchlist-page">
            <div className="watchlist-hero">
                <header className="watchlist-header">
                    <h1>Watchlist</h1>
                    <p>Save movies to watch later</p>
                </header>

                <div className="watchlist-stats" aria-label="Watchlist summary">
                    <div className="watchlist-stat">
                        <span aria-hidden="true">▱</span>
                        <div>
                            <strong>{watchlist.length}</strong>
                            <small>Total Saved</small>
                        </div>
                    </div>
                    <div className="watchlist-stat">
                        <span aria-hidden="true">◉</span>
                        <div>
                            <strong>{statusCounts.watching}</strong>
                            <small>Watching</small>
                        </div>
                    </div>
                    <div className="watchlist-stat">
                        <span aria-hidden="true">✓</span>
                        <div>
                            <strong>{statusCounts.watched}</strong>
                            <small>Watched</small>
                        </div>
                    </div>
                </div>
            </div>

            <div className="watchlist-controls">
                <div className="watchlist-tabs" aria-label="Watchlist status filters">
                    {WATCH_STATUS_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={activeStatus === option.value ? "active" : ""}
                            aria-pressed={activeStatus === option.value}
                            onClick={() => setActiveStatus(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <div className="watchlist-tools">
                    <form className="watchlist-search" role="search" onSubmit={(event) => event.preventDefault()}>
                        <span aria-hidden="true">⌕</span>
                        <input
                            type="search"
                            placeholder="Search watchlist..."
                            aria-label="Search watchlist"
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                        />
                    </form>

                    <SortDropdown
                        options={WATCH_SORT_OPTIONS}
                        value={sortValue}
                        onChange={setSortValue}
                    />
                </div>
            </div>

            {watchlist.length === 0 ? (
                <div className="watchlist-empty">
                    <h2>No Watchlist Movies Yet</h2>
                    <p>Add movies from Home or Movies to build your planned-to-watch queue.</p>
                </div>
            ) : visibleMovies.length > 0 ? (
                <div className="watchlist-list">
                    {visibleMovies.map((movie, index) => (
                        <WatchlistRow
                            key={movie.id}
                            movie={movie}
                            index={index}
                            status={getWatchStatus(movie.id)}
                            onAdvanceStatus={handleAdvanceStatus}
                            onStatusChange={updateWatchStatus}
                            onRemove={removeFromWatchlist}
                        />
                    ))}
                </div>
            ) : (
                <div className="watchlist-empty">
                    <h2>No matching watchlist items.</h2>
                    <p>Try another title or status filter.</p>
                </div>
            )}
        </section>
    )
}

export default Watchlist
