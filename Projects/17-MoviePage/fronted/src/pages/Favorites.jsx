import { useMemo, useState } from "react"
import EmptyState from "../components/EmptyState"
import MovieCatalogCard from "../components/MovieCatalogCard"
import PageHeader from "../components/PageHeader"
import SearchField from "../components/SearchField"
import SortDropdown from "../components/SortDropdown"
import { LIBRARY_SORT_OPTIONS, MOVIE_GENRE_NAMES } from "../constants/movieMeta"
import "../css/Movies.css"
import "../css/Favorites.css"
import { useMovieContext } from "../Contexts/MovieContextCore"

const getReleaseYearNumber = (movie) => {
    return Number(movie?.release_date?.split("-")[0] || 0)
}

const sortFavoriteMovies = (movies, sortValue) => {
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

const getAverageRating = (movies) => {
    const ratedMovies = movies.filter((movie) => Number(movie.vote_average) > 0)

    if (ratedMovies.length === 0) {
        return "0.0"
    }

    const ratingTotal = ratedMovies.reduce((total, movie) => total + Number(movie.vote_average || 0), 0)
    return (ratingTotal / ratedMovies.length).toFixed(1)
}

function Favorites() {
    const { favorites } = useMovieContext()
    const [searchValue, setSearchValue] = useState("")
    const [sortValue, setSortValue] = useState("rating")
    const favoriteMovies = useMemo(() => {
        const normalizedSearch = searchValue.trim().toLowerCase()
        const filteredMovies = normalizedSearch
            ? favorites.filter((movie) => movie.title?.toLowerCase().includes(normalizedSearch))
            : favorites

        return sortFavoriteMovies(filteredMovies, sortValue)
    }, [favorites, searchValue, sortValue])
    const averageRating = useMemo(() => getAverageRating(favorites), [favorites])

    return (
        <section className="favorites-page">
            <div className="favorites-hero">
                <PageHeader
                    className="favorites-header"
                    title="Favorites"
                    description="Movies you love most"
                />

                <div className="favorites-stats" aria-label="Favorites summary">
                    <div className="favorite-stat">
                        <span className="favorite-stat-icon" aria-hidden="true">♡</span>
                        <div>
                            <strong>{favorites.length}</strong>
                            <span>Total Favorites</span>
                        </div>
                    </div>
                    <div className="favorite-stat">
                        <span className="favorite-stat-icon" aria-hidden="true">★</span>
                        <div>
                            <strong>{averageRating}</strong>
                            <span>Average Rating</span>
                        </div>
                    </div>
                </div>
            </div>

            {favorites.length > 0 && (
                <div className="favorites-toolbar">
                    <SearchField
                        className="favorites-search"
                        placeholder="Search favorites..."
                        ariaLabel="Search favorite movies"
                        value={searchValue}
                        onChange={setSearchValue}
                    />

                    <SortDropdown
                        options={LIBRARY_SORT_OPTIONS}
                        value={sortValue}
                        onChange={setSortValue}
                    />
                </div>
            )}

            {favorites.length === 0 ? (
                <EmptyState
                    className="favorites-empty"
                    title="No Favorite Movies Yet"
                    description="Use the heart button on Home or Movies to build your personal collection."
                />
            ) : favoriteMovies.length > 0 ? (
                <div className="catalog-grid favorites-grid">
                    {favoriteMovies.map((movie) => (
                        <MovieCatalogCard
                            key={movie.id}
                            movie={movie}
                            genreNames={MOVIE_GENRE_NAMES}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState
                    className="favorites-empty"
                    title="No matching favorites."
                    description="Try another title or clear the search field."
                />
            )}
        </section>
    )
}

export default Favorites
