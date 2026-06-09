function WatchlistToggleButton({ movie, inWatchlist, onToggle, className = "" }) {
    return (
        <button
            type="button"
            className={`watchlist-toggle ${inWatchlist ? "active" : ""} ${className}`}
            aria-label={`${inWatchlist ? "Remove" : "Add"} ${movie.title} ${inWatchlist ? "from" : "to"} watchlist`}
            aria-pressed={inWatchlist}
            title={inWatchlist ? "Remove from watchlist" : "Add to watchlist"}
            onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                onToggle(movie)
            }}
        >
            <span aria-hidden="true">{inWatchlist ? "✓" : "＋"}</span>
        </button>
    )
}

export default WatchlistToggleButton
