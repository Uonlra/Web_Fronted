import { getMoviePoster, getRating, getReleaseYear } from "../utils/movieFormatters"

function WatchlistPanel({ movies }) {
    return (
        <aside className="watchlist-panel">
            <div className="watchlist-heading">
                <h2>My Watchlist</h2>
                <button type="button">View all</button>
            </div>

            {movies.length > 0 ? (
                <div className="watchlist-items">
                    {movies.map((movie) => {
                        const posterUrl = getMoviePoster(movie)

                        return (
                            <article className="watchlist-item" key={`watchlist-${movie.id}`}>
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
                                <button className="watchlist-more" type="button" aria-label={`More options for ${movie.title}`}>
                                    ⋮
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
