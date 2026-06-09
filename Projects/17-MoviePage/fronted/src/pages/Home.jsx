import { useEffect, useState } from 'react'
import FeaturedMovie from "../components/FeaturedMovie"
import HomeSkeleton from "../components/HomeSkeleton"
import MovieSection from "../components/MovieSection"
import MovieSearchForm from "../components/MovieSearchForm"
import WatchlistPanel from "../components/WatchlistPanel"
import {
    getNowPlayingMovies,
    getTopRatedMovies,
    getTrendingMovies,
    searchMovies
} from "../services/api"
import { useMovieContext } from "../Contexts/MovieContextCore"
import '../css/Home.css'

const INITIAL_SECTIONS = {
    trending: [],
    newReleases: [],
    topRated: []
}

const getHomeMovieGroups = async () => {
    const [trendingMovies, newReleaseMovies, topRatedMovies] = await Promise.all([
        getTrendingMovies(),
        getNowPlayingMovies(),
        getTopRatedMovies()
    ])

    return {
        featuredMovie: trendingMovies[0] || newReleaseMovies[0] || topRatedMovies[0] || null,
        sections: {
            trending: trendingMovies.slice(1, 6),
            newReleases: newReleaseMovies.slice(0, 5),
            topRated: topRatedMovies.slice(0, 5)
        }
    }
}

function Home() {
    const [searchQuery, setSearchQuery] = useState('')
    const [featuredMovie, setFeaturedMovie] = useState(null)
    const [sections, setSections] = useState(INITIAL_SECTIONS)
    const [isSearchMode, setIsSearchMode] = useState(false)
    const [submittedQuery, setSubmittedQuery] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const {
        watchlist,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist
    } = useMovieContext()

    useEffect(() => {
        const loadHomeMovies = async () => {
            try {
                setError(null)
                const homeMovieGroups = await getHomeMovieGroups()

                setFeaturedMovie(homeMovieGroups.featuredMovie)
                setSections(homeMovieGroups.sections)
                setIsSearchMode(false)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        loadHomeMovies()
    }, [])

    const loadHomeMovies = async () => {
        const homeMovieGroups = await getHomeMovieGroups()

        setFeaturedMovie(homeMovieGroups.featuredMovie)
        setSections(homeMovieGroups.sections)
        setIsSearchMode(false)
        setSubmittedQuery('')
    }

    const handleSearch = async (e) => {
        e.preventDefault()

        if (loading) { return }

        setLoading(true)
        setError(null)

        try {
            const query = searchQuery.trim()
            if (!query) {
                await loadHomeMovies()
                return
            }

            const results = await searchMovies(query)

            setFeaturedMovie(results[0] || null)
            setSections({
                trending: results.slice(1, 6),
                newReleases: results.slice(6, 11),
                topRated: results.slice(11, 16)
            })
            setIsSearchMode(true)
            setSubmittedQuery(query)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleClearSearch = async () => {
        setSearchQuery('')
        setLoading(true)
        setError(null)

        try {
            await loadHomeMovies()
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleFavorite = (movie) => {
        if (isFavorite(movie.id)) {
            removeFromFavorites(movie.id)
            return
        }

        addToFavorites(movie)
    }

    const handleToggleWatchlist = (movie) => {
        if (isInWatchlist(movie.id)) {
            removeFromWatchlist(movie.id)
            return
        }

        addToWatchlist(movie)
    }

    const watchlistMovies = watchlist.slice(0, 3)
    const hasAnyMovies = Boolean(featuredMovie) || Object.values(sections).some((movies) => movies.length > 0)
    const sectionTitles = isSearchMode
        ? {
            trending: "Search Matches",
            newReleases: "More Results",
            topRated: "Related Results"
        }
        : {
            trending: "Trending Movies",
            newReleases: "New Releases",
            topRated: "Top Rated"
        }

    return (
        <div className="home">
            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <HomeSkeleton />
            ) : hasAnyMovies ? (
                <>
                    <section className="dashboard-top">
                        {featuredMovie && (
                            <FeaturedMovie
                                movie={featuredMovie}
                                eyebrow={isSearchMode ? "Search Highlight" : "Featured"}
                                favorite={isFavorite(featuredMovie.id)}
                                inWatchlist={isInWatchlist(featuredMovie.id)}
                                onToggleFavorite={handleToggleFavorite}
                                onToggleWatchlist={handleToggleWatchlist}
                            />
                        )}

                        <WatchlistPanel movies={watchlistMovies} onRemove={removeFromWatchlist} />
                    </section>

                    <MovieSearchForm
                        value={searchQuery}
                        loading={loading}
                        isSearchMode={isSearchMode}
                        submittedQuery={submittedQuery}
                        onChange={setSearchQuery}
                        onSubmit={handleSearch}
                        onClear={handleClearSearch}
                    />

                    <MovieSection
                        title={sectionTitles.trending}
                        movies={sections.trending}
                        isFavorite={isFavorite}
                        isInWatchlist={isInWatchlist}
                        onToggleFavorite={handleToggleFavorite}
                        onToggleWatchlist={handleToggleWatchlist}
                    />
                    <MovieSection
                        title={sectionTitles.newReleases}
                        movies={sections.newReleases}
                        isFavorite={isFavorite}
                        isInWatchlist={isInWatchlist}
                        onToggleFavorite={handleToggleFavorite}
                        onToggleWatchlist={handleToggleWatchlist}
                    />
                    <MovieSection
                        title={sectionTitles.topRated}
                        movies={sections.topRated}
                        isFavorite={isFavorite}
                        isInWatchlist={isInWatchlist}
                        onToggleFavorite={handleToggleFavorite}
                        onToggleWatchlist={handleToggleWatchlist}
                    />
                </>
            ) : (
                <div className="empty-message">
                    <h2>No movies found.</h2>
                    <p>Try a different title or clear the search to return to the dashboard.</p>
                    <button type="button" className="search-button" onClick={handleClearSearch}>Clear Search</button>
                </div>
            )}
        </div>
    )
}

export default Home
