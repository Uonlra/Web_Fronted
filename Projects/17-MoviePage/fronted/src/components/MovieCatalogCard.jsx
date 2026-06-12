import { useMovieDetailsModal } from "../Contexts/MovieDetailsModalContext"
import { useMovieContext } from "../Contexts/MovieContextCore"
import { getMovieImage, getRating, getReleaseYear } from "../utils/movieFormatters"

function MovieCatalogCard({ movie, genreNames }) {
    const { openMovieDetails } = useMovieDetailsModal()
    const {
        addToFavorites,
        removeFromFavorites,
        isFavorite
    } = useMovieContext()
    const favorite = isFavorite(movie.id)
    const imageUrl = getMovieImage(movie)
    const movieGenres = movie.genre_ids
        ?.map((genreId) => genreNames[genreId])
        .filter(Boolean)
        .slice(0, 2)
        .join(", ") || "Cinema"

    const handleFavoriteClick = (event) => {
        event.preventDefault()
        event.stopPropagation()

        if (favorite) {
            removeFromFavorites(movie.id)
            return
        }

        addToFavorites(movie)
    }

    return (
        <article className="catalog-card">
            <button
                type="button"
                className="catalog-card-link"
                aria-label={`View details for ${movie.title}`}
                onClick={() => openMovieDetails(movie.id)}
            />
            <div className="catalog-card-image">
                {imageUrl ? (
                    <img src={imageUrl} alt={movie.title} />
                ) : (
                    <div className="catalog-card-placeholder">No image</div>
                )}
            </div>
            <div className="catalog-card-body">
                <div className="catalog-card-heading">
                    <h2>{movie.title}</h2>
                    <button
                        type="button"
                        className={`catalog-favorite ${favorite ? "active" : ""}`}
                        aria-label={`${favorite ? "Remove" : "Add"} ${movie.title} ${favorite ? "from" : "to"} favorites`}
                        aria-pressed={favorite}
                        onClick={handleFavoriteClick}
                    >
                        <span aria-hidden="true">{favorite ? "♥" : "♡"}</span>
                    </button>
                </div>
                <p className="catalog-card-meta">
                    <span>{getReleaseYear(movie)}</span>
                    <span aria-hidden="true">•</span>
                    <span className="catalog-rating-star" aria-hidden="true">★</span>
                    <span>{getRating(movie)}</span>
                </p>
                <p className="catalog-card-genres">{movieGenres}</p>
            </div>
        </article>
    )
}

export default MovieCatalogCard
