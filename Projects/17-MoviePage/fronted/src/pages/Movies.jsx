import { useEffect, useMemo, useState } from "react"
import MovieCatalogCard from "../components/MovieCatalogCard"
import SortDropdown from "../components/SortDropdown"
import { discoverMovies, searchMoviePage } from "../services/api"
import "../css/Movies.css"

const GENRE_FILTERS = [
    { label: "All", value: "" },
    { label: "Action", value: "28" },
    { label: "Drama", value: "18" },
    { label: "Sci-Fi", value: "878" },
    { label: "Thriller", value: "53" },
    { label: "Comedy", value: "35" }
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

const SORT_OPTIONS = [
    {
        label: "Popular",
        value: "popular",
        discoverSort: "popularity.desc"
    },
    {
        label: "Top Rated",
        value: "top-rated",
        discoverSort: "vote_average.desc"
    },
    {
        label: "Newest",
        value: "newest",
        discoverSort: "primary_release_date.desc"
    }
]

const MAX_VISIBLE_PAGES = 10

const getSortOption = (sortValue) => {
    return SORT_OPTIONS.find((option) => option.value === sortValue) || SORT_OPTIONS[0]
}

const sortSearchMovies = (movies, sortValue) => {
    return [...movies].sort((firstMovie, secondMovie) => {
        if (sortValue === "top-rated") {
            return Number(secondMovie.vote_average || 0) - Number(firstMovie.vote_average || 0)
        }

        if (sortValue === "newest") {
            return new Date(secondMovie.release_date || 0) - new Date(firstMovie.release_date || 0)
        }

        return Number(secondMovie.popularity || 0) - Number(firstMovie.popularity || 0)
    })
}

const getPaginationItems = (currentPage, totalPages) => {
    const boundedTotal = Math.min(totalPages, MAX_VISIBLE_PAGES)

    if (boundedTotal <= 4) {
        return Array.from({ length: boundedTotal }, (_, index) => index + 1)
    }

    if (currentPage <= 3) {
        return [1, 2, 3, "ellipsis", boundedTotal]
    }

    if (currentPage >= boundedTotal - 2) {
        return [1, "ellipsis", boundedTotal - 2, boundedTotal - 1, boundedTotal]
    }

    return [1, "ellipsis", currentPage, "ellipsis-end", boundedTotal]
}

function Movies() {
    const [movies, setMovies] = useState([])
    const [searchValue, setSearchValue] = useState("")
    const [submittedSearch, setSubmittedSearch] = useState("")
    const [activeGenre, setActiveGenre] = useState("")
    const [sortValue, setSortValue] = useState("popular")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const sortOption = getSortOption(sortValue)
    const visibleTotalPages = Math.max(1, Math.min(totalPages, MAX_VISIBLE_PAGES))
    const paginationItems = useMemo(
        () => getPaginationItems(currentPage, visibleTotalPages),
        [currentPage, visibleTotalPages]
    )

    useEffect(() => {
        let ignoreResult = false

        const loadMovies = async () => {
            setLoading(true)
            setError(null)

            try {
                if (submittedSearch) {
                    const moviePage = await searchMoviePage(submittedSearch, { page: currentPage })
                    const filteredMovies = activeGenre
                        ? moviePage.movies.filter((movie) => movie.genre_ids?.includes(Number(activeGenre)))
                        : moviePage.movies

                    if (ignoreResult) { return }

                    setMovies(sortSearchMovies(filteredMovies, sortValue))
                    setTotalPages(moviePage.totalPages)
                    return
                }

                const moviePage = await discoverMovies({
                    page: currentPage,
                    sort_by: sortOption.discoverSort,
                    with_genres: activeGenre,
                    "vote_count.gte": sortValue === "top-rated" ? 200 : undefined,
                    "primary_release_date.lte": new Date().toISOString().slice(0, 10)
                })

                if (ignoreResult) { return }

                setMovies(moviePage.movies)
                setTotalPages(moviePage.totalPages)
            } catch (error) {
                if (!ignoreResult) {
                    setMovies([])
                    setTotalPages(1)
                    setError(error.message)
                }
            } finally {
                if (!ignoreResult) {
                    setLoading(false)
                }
            }
        }

        loadMovies()

        return () => {
            ignoreResult = true
        }
    }, [activeGenre, currentPage, sortOption.discoverSort, sortValue, submittedSearch])

    const handleSearchSubmit = (event) => {
        event.preventDefault()
        setSubmittedSearch(searchValue.trim())
        setCurrentPage(1)
    }

    const handleGenreChange = (genreValue) => {
        setActiveGenre(genreValue)
        setCurrentPage(1)
    }

    const handleSortChange = (nextSortValue) => {
        setSortValue(nextSortValue)
        setCurrentPage(1)
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(Math.min(Math.max(pageNumber, 1), visibleTotalPages))
    }

    return (
        <section className="movies-page">
            <header className="movies-page-header">
                <h1>Movies</h1>
                <p>Browse your favorite films</p>
            </header>

            <div className="movies-toolbar">
                <form className="movies-search" role="search" onSubmit={handleSearchSubmit}>
                    <span aria-hidden="true">⌕</span>
                    <input
                        type="search"
                        placeholder="Search movies..."
                        aria-label="Search movies in catalog"
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                </form>

                <SortDropdown
                    options={SORT_OPTIONS}
                    value={sortValue}
                    onChange={handleSortChange}
                />

                <div className="movies-genres" aria-label="Movie genres">
                    {GENRE_FILTERS.map((genre) => (
                        <button
                            key={genre.label}
                            type="button"
                            className={activeGenre === genre.value ? "active" : ""}
                            aria-pressed={activeGenre === genre.value}
                            onClick={() => handleGenreChange(genre.value)}
                        >
                            {genre.label}
                        </button>
                    ))}
                </div>
            </div>

            {submittedSearch && (
                <p className="movies-result-note">
                    Showing results for <span>{submittedSearch}</span>
                </p>
            )}

            {error && <div className="movies-status error">{error}</div>}

            {loading ? (
                <div className="catalog-grid" aria-label="Loading movies">
                    {Array.from({ length: 12 }, (_, index) => (
                        <div className="catalog-card skeleton" key={`catalog-skeleton-${index}`}>
                            <div className="catalog-card-image"></div>
                            <div className="catalog-card-body">
                                <div className="skeleton-line wide"></div>
                                <div className="skeleton-line short"></div>
                                <div className="skeleton-line medium"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : movies.length > 0 ? (
                <>
                    <div className="catalog-grid">
                        {movies.slice(0, 12).map((movie) => (
                            <MovieCatalogCard
                                key={movie.id}
                                movie={movie}
                                genreNames={GENRE_NAMES}
                            />
                        ))}
                    </div>

                    <nav className="movies-pagination" aria-label="Movies pagination">
                        <button
                            type="button"
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <span aria-hidden="true">‹</span>
                            Previous
                        </button>
                        {paginationItems.map((pageItem) => pageItem === "ellipsis" || pageItem === "ellipsis-end" ? (
                            <span className="pagination-ellipsis" key={pageItem}>...</span>
                        ) : (
                            <button
                                key={pageItem}
                                type="button"
                                className={currentPage === pageItem ? "active" : ""}
                                aria-current={currentPage === pageItem ? "page" : undefined}
                                onClick={() => handlePageChange(pageItem)}
                            >
                                {pageItem}
                            </button>
                        ))}
                        <button
                            type="button"
                            disabled={currentPage === visibleTotalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                            <span aria-hidden="true">›</span>
                        </button>
                    </nav>
                </>
            ) : (
                <div className="movies-status">
                    <h2>No movies found.</h2>
                    <p>Try another title, genre, or sort option.</p>
                </div>
            )}
        </section>
    )
}

export default Movies
