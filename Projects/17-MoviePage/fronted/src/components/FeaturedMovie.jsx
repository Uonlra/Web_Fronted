import { getMovieImage, getRating, getReleaseYear } from "../utils/movieFormatters"
import FavoriteToggleButton from "./FavoriteToggleButton"
import WatchlistToggleButton from "./WatchlistToggleButton"

function FeaturedMovie({
    movie,
    eyebrow,
    favorite,
    inWatchlist,
    onToggleFavorite,
    onToggleWatchlist
}) {
    const featuredImage = getMovieImage(movie)

    return (
        <article className="featured-panel">
            <div className="featured-art">
                {featuredImage ? (
                    <img src={featuredImage} alt={movie.title} />
                ) : (
                    <div className="featured-placeholder">Featured movie</div>
                )}
                <FavoriteToggleButton
                    movie={movie}
                    favorite={favorite}
                    onToggle={onToggleFavorite}
                    className="featured-favorite"
                />
                <WatchlistToggleButton
                    movie={movie}
                    inWatchlist={inWatchlist}
                    onToggle={onToggleWatchlist}
                    className="featured-watchlist"
                />
                <div className="featured-dots" aria-hidden="true">
                    <span className="active"></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <div className="featured-copy">
                <p className="eyebrow">{eyebrow}</p>
                <h1>{movie.title}</h1>
                <div className="featured-meta">
                    <span>{getReleaseYear(movie)}</span>
                    <span>3h 0m</span>
                    <span>R</span>
                    <span>Drama</span>
                    <span>History</span>
                </div>
                <div className="featured-rating">
                    <span>★</span>
                    <strong>{getRating(movie)}</strong>
                    <span>/10</span>
                    <mark>IMDb</mark>
                </div>
                <p className="featured-description">
                    {movie.overview || "A cinematic story with striking characters, high-stakes choices, and an atmosphere built for the big screen."}
                </p>
                <div className="featured-actions">
                    <button className="play-button" type="button">
                        <span aria-hidden="true">▶</span>
                        Play
                    </button>
                    <button className="details-button" type="button">
                        <span aria-hidden="true">↗</span>
                        Details Soon
                    </button>
                </div>
            </div>
        </article>
    )
}

export default FeaturedMovie
