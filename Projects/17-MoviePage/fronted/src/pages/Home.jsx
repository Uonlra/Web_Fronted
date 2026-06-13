import { useEffect, useState } from 'react'
import EmptyState from "../components/EmptyState"
import { useSearchParams } from 'react-router-dom'
import FeaturedMovie from "../components/FeaturedMovie"
import HomeSkeleton from "../components/HomeSkeleton"
import MovieSection from "../components/MovieSection"
import WatchlistPanel from "../components/WatchlistPanel"
import useFeaturedCarousel from "../hooks/useFeaturedCarousel"
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

    const fallbackFeaturedMovies = [
        ...newReleaseMovies,
        ...topRatedMovies
    ].slice(0, 5)

    return {
        featuredMovies: trendingMovies.slice(0, 5).length > 0
            ? trendingMovies.slice(0, 5)
            : fallbackFeaturedMovies,
        sections: {
            trending: trendingMovies.slice(5, 10),
            newReleases: newReleaseMovies.slice(0, 5),
            topRated: topRatedMovies.slice(0, 5)
        }
    }
}

function Home() {
    const [featuredMovies, setFeaturedMovies] = useState([])
    const [sections, setSections] = useState(INITIAL_SECTIONS)
    const [isSearchMode, setIsSearchMode] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()
    const submittedQuery = searchParams.get('q')?.trim() || ''
    const {
        watchlist,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist
    } = useMovieContext()
    const {
        activeIndex: featuredIndex,
        activeMovie: featuredMovie,
        resetCarousel,
        showMovie: showFeaturedMovie,
        showNext: showNextFeaturedMovie,
        showPrevious: showPreviousFeaturedMovie,
        onHoverStart: handleFeaturedHoverStart,
        onHoverEnd: handleFeaturedHoverEnd,
        onFocusStart: handleFeaturedFocusStart,
        onFocusEnd: handleFeaturedFocusEnd
    } = useFeaturedCarousel(featuredMovies)

    useEffect(() => {
        let ignoreResult = false

        const loadMovies = async () => {
            setLoading(true)
            try {
                setError(null)
                const query = submittedQuery.trim()

                if (query) {
                    const results = await searchMovies(query)

                    if (ignoreResult) { return }

                    setFeaturedMovies(results.slice(0, 5))
                    resetCarousel()
                    setSections({
                        trending: results.slice(5, 10),
                        newReleases: results.slice(10, 15),
                        topRated: results.slice(15, 20)
                    })
                    setIsSearchMode(true)
                    return
                }

                const homeMovieGroups = await getHomeMovieGroups()

                if (ignoreResult) { return }

                setFeaturedMovies(homeMovieGroups.featuredMovies)
                resetCarousel()
                setSections(homeMovieGroups.sections)
                setIsSearchMode(false)
            } catch (error) {
                if (!ignoreResult) {
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
    }, [resetCarousel, submittedQuery])

    const handleClearSearch = () => {
        setSearchParams({})
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
    const hasAnyMovies = featuredMovies.length > 0 || Object.values(sections).some((movies) => movies.length > 0)
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
                                movies={featuredMovies}
                                activeIndex={featuredIndex}
                                eyebrow={isSearchMode ? "Search Highlight" : "Featured"}
                                favorite={isFavorite(featuredMovie.id)}
                                inWatchlist={isInWatchlist(featuredMovie.id)}
                                onSelectMovie={showFeaturedMovie}
                                onShowNext={showNextFeaturedMovie}
                                onShowPrevious={showPreviousFeaturedMovie}
                                onHoverStart={handleFeaturedHoverStart}
                                onHoverEnd={handleFeaturedHoverEnd}
                                onFocusStart={handleFeaturedFocusStart}
                                onFocusEnd={handleFeaturedFocusEnd}
                                onToggleFavorite={handleToggleFavorite}
                                onToggleWatchlist={handleToggleWatchlist}
                            />
                        )}

                        <WatchlistPanel movies={watchlistMovies} onRemove={removeFromWatchlist} />
                    </section>

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
                <EmptyState
                    className="empty-message"
                    title="No movies found."
                    description="Try a different title or clear the search to return to the dashboard."
                >
                    <button type="button" className="search-button" onClick={handleClearSearch}>Clear Search</button>
                </EmptyState>
            )}
        </div>
    )
}

export default Home
