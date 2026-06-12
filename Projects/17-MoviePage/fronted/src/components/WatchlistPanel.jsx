import { Link } from "react-router-dom"
import { useMovieDetailsModal } from "../Contexts/MovieDetailsModalContext"
import { getMoviePoster, getRating, getReleaseYear } from "../utils/movieFormatters"

function WatchlistPanel({ movies, onRemove }) {
    const { openMovieDetails } = useMovieDetailsModal()

    return (
        <aside className="watchlist-panel">
            <div className="watchlist-heading">
                <h2>My Watchlist</h2>
                <Link to="/watchlist">View all</Link>
            </div>

            {movies.length > 0 ? (
                <div className="watchlist-items">
                    {movies.map((movie) => {
                        const posterUrl = getMoviePoster(movie)

                        return (
                            <article className="watchlist-item" key={`watchlist-${movie.id}`}>
                                <button
                                    type="button"
                                    className="watchlist-item-link"
                                    aria-label={`View details for ${movie.title}`}
                                    onClick={() => openMovieDetails(movie.id)}
                                />
                                <div className="watchlist-poster">
                                    {posterUrl ? (
                                        <img src={posterUrl} alt={movie.title} />
                                    ) : (
                                        <div className="watchlist-placeholder">No poster</div>
                                    )}
                                </div>
                                <div className="watchlist-copy">
                                    <h3>{movie.title}</h3>
                                    <p>{getReleaseYear(movie)} <span>★</span> {getRating(movie)}</p>
                                </div>
                                <button
                                    className="watchlist-remove"
                                    type="button"
                                    aria-label={`Remove ${movie.title} from watchlist`}
                                    onClick={() => onRemove(movie.id)}
                                >
                                    ×
                                </button>
                            </article>
                        )
                    })}
                </div>
            ) : (
                <div className="watchlist-panel-empty">
                    <p>No watchlist movies yet.</p>
                    <span>Add movies from Home or a details page to build your queue.</span>
                </div>
            )}
        </aside>
    )
}

export default WatchlistPanel
