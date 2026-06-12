import { useMovieDetailsModal } from "../Contexts/MovieDetailsModalContext"
import { getMovieImage, getRating, getReleaseYear } from "../utils/movieFormatters"
import FavoriteToggleButton from "./FavoriteToggleButton"
import WatchlistToggleButton from "./WatchlistToggleButton"

function MovieStripCard({ movie, favorite, inWatchlist, onToggleFavorite, onToggleWatchlist }) {
    const { openMovieDetails } = useMovieDetailsModal()
    const imageUrl = getMovieImage(movie)

    return (
        <article className="strip-movie-card">
            <button
                type="button"
                className="strip-card-link"
                aria-label={`View details for ${movie.title}`}
                onClick={() => openMovieDetails(movie.id)}
            />
            <div className="strip-movie-image">
                {imageUrl ? (
                    <img src={imageUrl} alt={movie.title} />
                ) : (
                    <div className="strip-movie-placeholder">No image</div>
                )}
                <div className="strip-card-actions">
                    <FavoriteToggleButton
                        movie={movie}
                        favorite={favorite}
                        onToggle={onToggleFavorite}
                        className="strip-favorite"
                    />
                    <WatchlistToggleButton
                        movie={movie}
                        inWatchlist={inWatchlist}
                        onToggle={onToggleWatchlist}
                        className="strip-watchlist"
                    />
                </div>
            </div>
            <div className="strip-movie-info">
                <h3>{movie.title}</h3>
                <p>{getReleaseYear(movie)} <span>★</span> {getRating(movie)}</p>
            </div>
        </article>
    )
}

export default MovieStripCard
