import { useMemo, useState } from "react"
import MovieCatalogCard from "../components/MovieCatalogCard"
import SortDropdown from "../components/SortDropdown"
import "../css/Movies.css"
import "../css/Favorites.css"
import { useMovieContext } from "../Contexts/MovieContextCore"

const FAVORITE_SORT_OPTIONS = [
    { label: "Rating", value: "rating" },
    { label: "Release Year", value: "year" },
    { label: "Title", value: "title" }
]

const GENRE_NAMES = {
    12: "Adventure",
    14: "Fantasy",
    16: "Animation",
    18: "Drama",
    27: "Horror",
    28: "Action",
    35: "Comedy",
    36: "History",
    37: "Western",
    53: "Thriller",
    80: "Crime",
    99: "Documentary",
    878: "Sci-Fi",
    9648: "Mystery",
    10402: "Music",
    10749: "Romance",
    10751: "Family",
    10752: "War",
    10770: "TV Movie"
}

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
                <header className="favorites-header">
                    <h1>Favorites</h1>
                    <p>Movies you love most</p>
                </header>

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
                    <form className="favorites-search" role="search" onSubmit={(event) => event.preventDefault()}>
                        <span aria-hidden="true">⌕</span>
                        <input
                            type="search"
                            placeholder="Search favorites..."
                            aria-label="Search favorite movies"
                            value={searchValue}
                            onChange={(event) => setSearchValue(event.target.value)}
                        />
                    </form>

                    <SortDropdown
                        options={FAVORITE_SORT_OPTIONS}
                        value={sortValue}
                        onChange={setSortValue}
                    />
                </div>
            )}

            {favorites.length === 0 ? (
                <div className="favorites-empty">
                    <h2>No Favorite Movies Yet</h2>
                    <p>Use the heart button on Home or Movies to build your personal collection.</p>
                </div>
            ) : favoriteMovies.length > 0 ? (
                <div className="catalog-grid favorites-grid">
                    {favoriteMovies.map((movie) => (
                        <MovieCatalogCard
                            key={movie.id}
                            movie={movie}
                            genreNames={GENRE_NAMES}
                        />
                    ))}
                </div>
            ) : (
                <div className="favorites-empty">
                    <h2>No matching favorites.</h2>
                    <p>Try another title or clear the search field.</p>
                </div>
            )}
        </section>
    )
}

export default Favorites
