import MovieStripCard from "./MovieStripCard"

function MovieSection({ title, movies, isFavorite, isInWatchlist, onToggleFavorite, onToggleWatchlist }) {
    if (movies.length === 0) {
        return null
    }

    return (
        <section className="movie-section">
            <div className="section-heading">
                <h2>{title}</h2>
                <button type="button">View all</button>
            </div>
            <div className="movie-strip">
                {movies.map((movie) => (
                    <MovieStripCard
                        key={`${title}-${movie.id}`}
                        movie={movie}
                        favorite={isFavorite(movie.id)}
                        inWatchlist={isInWatchlist(movie.id)}
                        onToggleFavorite={onToggleFavorite}
                        onToggleWatchlist={onToggleWatchlist}
                    />
                ))}
            </div>
        </section>
    )
}

export default MovieSection
