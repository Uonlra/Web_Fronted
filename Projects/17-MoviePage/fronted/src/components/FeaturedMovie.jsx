import { useEffect, useRef } from "react"
import { getMovieImage, getRating, getReleaseYear } from "../utils/movieFormatters"
import FavoriteToggleButton from "./FavoriteToggleButton"
import WatchlistToggleButton from "./WatchlistToggleButton"

function FeaturedMovie({
    movie,
    movies = [],
    activeIndex = 0,
    eyebrow,
    favorite,
    inWatchlist,
    onSelectMovie,
    onShowNext,
    onShowPrevious,
    onHoverStart,
    onHoverEnd,
    onFocusStart,
    onFocusEnd,
    onToggleFavorite,
    onToggleWatchlist
}) {
    const featuredImage = getMovieImage(movie)
    const canSwitchMovies = movies.length > 1
    const featuredPanelRef = useRef(null)

    useEffect(() => {
        const handlePointerMove = (event) => {
            if (featuredPanelRef.current?.contains(event.target)) {
                onHoverStart?.()
                return
            }

            onHoverEnd?.()
        }

        window.addEventListener("pointermove", handlePointerMove)

        return () => window.removeEventListener("pointermove", handlePointerMove)
    }, [onHoverEnd, onHoverStart])

    const handleKeyDown = (event) => {
        if (!canSwitchMovies) {
            return
        }

        if (event.key === "ArrowRight") {
            event.preventDefault()
            onShowNext?.()
            return
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault()
            onShowPrevious?.()
        }
    }

    const handleBlur = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            onFocusEnd?.()
        }
    }

    const handleHoverEnd = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            onHoverEnd?.()
        }
    }

    return (
        <article
            ref={featuredPanelRef}
            className="featured-panel"
            tabIndex={0}
            aria-label={`Featured movie: ${movie.title}`}
            onPointerEnter={onHoverStart}
            onPointerMove={onHoverStart}
            onPointerLeave={onHoverEnd}
            onPointerOut={handleHoverEnd}
            onMouseEnter={onHoverStart}
            onMouseMove={onHoverStart}
            onMouseLeave={onHoverEnd}
            onMouseOut={handleHoverEnd}
            onFocus={onFocusStart}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
        >
            <div className="featured-art">
                <div key={`featured-art-${movie.id}`} className="featured-art-media">
                    {featuredImage ? (
                        <img src={featuredImage} alt={movie.title} />
                    ) : (
                        <div className="featured-placeholder">Featured movie</div>
                    )}
                </div>
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
                <div className="featured-dots" role="group" aria-label="Featured movie selector">
                    {movies.map((featuredMovie, index) => (
                        <button
                            key={featuredMovie.id}
                            type="button"
                            className={index === activeIndex ? "active" : ""}
                            aria-label={`Show ${featuredMovie.title}`}
                            aria-pressed={index === activeIndex}
                            onClick={() => onSelectMovie?.(index)}
                        />
                    ))}
                </div>
            </div>

            <div key={`featured-copy-${movie.id}`} className="featured-copy">
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
