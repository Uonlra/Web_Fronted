import { useMemo, useState } from "react"
import EmptyState from "../components/EmptyState"
import PageHeader from "../components/PageHeader"
import SearchField from "../components/SearchField"
import SortDropdown from "../components/SortDropdown"
import { LIBRARY_SORT_OPTIONS, MOVIE_GENRE_NAMES } from "../constants/movieMeta"
import {
    NEXT_WATCH_STATUS,
    WATCH_STATUS_ACTION_LABELS,
    WATCH_STATUS_FILTER_OPTIONS,
    WATCH_STATUS_LABELS,
    WATCH_STATUS_OPTIONS
} from "../constants/watchStatus"
import { useMovieDetailsModal } from "../Contexts/MovieDetailsModalContext"
import { useMovieContext } from "../Contexts/MovieContextCore"
import { getMovieImage, getRating, getReleaseYear } from "../utils/movieFormatters"
import "../css/Movies.css"
import "../css/Watchlist.css"

const getReleaseYearNumber = (movie) => {
    return Number(movie?.release_date?.split("-")[0] || 0)
}

const getMovieGenres = (movie) => {
    return movie.genre_ids
        ?.map((genreId) => MOVIE_GENRE_NAMES[genreId])
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
                    {WATCH_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <span>{WATCH_STATUS_LABELS[status]}</span>
            </div>
            <button
                type="button"
                className={`watchlist-action ${status}`}
                onClick={() => onAdvanceStatus(movie.id, status)}
            >
                <span aria-hidden="true">{status === "watched" ? "↻" : "▶"}</span>
                {WATCH_STATUS_ACTION_LABELS[status]}
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
        updateWatchStatus(movieId, NEXT_WATCH_STATUS[currentStatus])
    }

    return (
        <section className="watchlist-page">
            <div className="watchlist-hero">
                <PageHeader
                    className="watchlist-header"
                    title="Watchlist"
                    description="Save movies to watch later"
                />

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
                    {WATCH_STATUS_FILTER_OPTIONS.map((option) => (
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
                    <SearchField
                        className="watchlist-search"
                        placeholder="Search watchlist..."
                        ariaLabel="Search watchlist"
                        value={searchValue}
                        onChange={setSearchValue}
                    />

                    <SortDropdown
                        options={LIBRARY_SORT_OPTIONS}
                        value={sortValue}
                        onChange={setSortValue}
                    />
                </div>
            </div>

            {watchlist.length === 0 ? (
                <EmptyState
                    className="watchlist-empty"
                    title="No Watchlist Movies Yet"
                    description="Add movies from Home or Movies to build your planned-to-watch queue."
                />
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
                <EmptyState
                    className="watchlist-empty"
                    title="No matching watchlist items."
                    description="Try another title or status filter."
                />
            )}
        </section>
    )
}

export default Watchlist
